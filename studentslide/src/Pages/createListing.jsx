import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api';

const DEFAULT_CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Other',
];

const emptyForm = {
  title: '',
  category: DEFAULT_CATEGORIES[0],
  price: '',
  description: '',
  image: '',
};

const CreateListing = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [form, setForm] = useState(emptyForm);
  const [editingListing, setEditingListing] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const pendingCount = useMemo(
    () => listings.filter((listing) => listing.listingState === 'pending').length,
    [listings]
  );

  const liveCount = useMemo(
    () => listings.filter((listing) => listing.listingState === 'live').length,
    [listings]
  );

  const loadListings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/listings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not load listings');
      }

      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [listingResponse, categoryResponse] = await Promise.all([
          fetch(`${API_URL}/listings`),
          fetch(`${API_URL}/categories`),
        ]);
        const [listingData, categoryData] = await Promise.all([
          listingResponse.json(),
          categoryResponse.json(),
        ]);

        if (!listingResponse.ok) {
          throw new Error(listingData.error || 'Could not load listings');
        }

        if (isMounted) {
          setListings(listingData);

          if (categoryResponse.ok && categoryData.length > 0) {
            setCategories(categoryData.map((category) => category.name));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingListing(null);
    setForm(emptyForm);
    setError('');
    setMessage('');
    setShowFormModal(true);
  };

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setForm({
      title: listing.title,
      category: listing.category,
      price: String(listing.price),
      description: listing.description,
      image: listing.image,
    });
    setError('');
    setMessage('');
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (!saving) {
      setShowFormModal(false);
    }
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price),
    };

    const endpoint = editingListing
      ? `${API_URL}/listings/${editingListing._id}`
      : `${API_URL}/listings`;

    try {
      const response = await fetch(endpoint, {
        method: editingListing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save listing');
      }

      setShowFormModal(false);
      setMessage(editingListing ? 'Listing updated successfully.' : 'Listing created and sent for review.');
      await loadListings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateListingState = async (listing, listingState) => {
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/listings/${listing._id}/state`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
        },
        body: JSON.stringify({ listingState }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not update listing state');
      }

      setMessage(`Listing marked as ${listingState}.`);
      await loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteListing = async () => {
    if (!listingToDelete) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/listings/${listingToDelete._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete listing');
      }

      setListingToDelete(null);
      setMessage('Listing deleted successfully.');
      await loadListings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="listing-page">
      <Container className="py-5">
        <div className="listing-toolbar">
          <div>
            <p className="listing-eyebrow">StudentSlide admin</p>
            <h1 className="listing-title">Listing CRUD</h1>
            <p className="listing-subtitle">
              Add products to MongoDB, edit details, approve pending listings, and delete test data.
            </p>
          </div>

          <Button className="listing-primary-btn" onClick={openCreateModal}>
            Add product
          </Button>
        </div>

        <Row className="g-3 mb-4">
          <Col md={4}>
            <div className="listing-stat">
              <span>Total listings</span>
              <strong>{listings.length}</strong>
            </div>
          </Col>
          <Col md={4}>
            <div className="listing-stat">
              <span>Pending review</span>
              <strong>{pendingCount}</strong>
            </div>
          </Col>
          <Col md={4}>
            <div className="listing-stat">
              <span>Live marketplace</span>
              <strong>{liveCount}</strong>
            </div>
          </Col>
        </Row>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="listing-panel">
          {loading ? (
            <div className="listing-loading">
              <Spinner animation="border" size="sm" />
              <span>Loading listings...</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="listing-empty">
              <h2>No products yet</h2>
              <p>Add the first product to test the database connection.</p>
              <Button className="listing-primary-btn" onClick={openCreateModal}>
                Add product
              </Button>
            </div>
          ) : (
            <Table responsive hover className="listing-table mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td>
                      <div className="listing-product-cell">
                        <img src={listing.image} alt={listing.title} className="listing-thumb" />
                        <div>
                          <strong>{listing.title}</strong>
                          <p>{listing.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{listing.category}</td>
                    <td>R {Number(listing.price).toFixed(2)}</td>
                    <td>
                      <Badge bg={listing.listingState === 'live' ? 'success' : 'warning'} text={listing.listingState === 'live' ? undefined : 'dark'}>
                        {listing.listingState}
                      </Badge>
                    </td>
                    <td>
                      <div className="listing-actions">
                        {listing.listingState !== 'live' ? (
                          <Button size="sm" variant="outline-success" onClick={() => updateListingState(listing, 'live')}>
                            Approve
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline-secondary" onClick={() => updateListingState(listing, 'pending')}>
                            Unpublish
                          </Button>
                        )}
                        <Button size="sm" variant="outline-primary" onClick={() => openEditModal(listing)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => setListingToDelete(listing)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>

      <Modal show={showFormModal} onHide={closeFormModal} centered size="lg">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>{editingListing ? 'Edit listing' : 'Add product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Product title</Form.Label>
                  <Form.Control name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={form.category} onChange={handleChange} required>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control name="image" type="url" value={form.image} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeFormModal} disabled={saving}>
              Cancel
            </Button>
            <Button className="listing-primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingListing ? 'Save changes' : 'Create listing'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={Boolean(listingToDelete)} onHide={() => !saving && setListingToDelete(null)} centered>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>Delete listing?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will remove <strong>{listingToDelete?.title}</strong> from the database.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setListingToDelete(null)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteListing} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete listing'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateListing;
