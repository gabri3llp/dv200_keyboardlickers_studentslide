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
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import {
  createListing,
  deleteListing as removeListing,
  getListings,
  updateListing,
  updateListingState as saveListingState,
} from '../api/listings';
import logo from '../assets/StudentSlide_Logo_Full.png';
import { listingCategories } from '../data/sampleListings';

const DEFAULT_CATEGORIES = listingCategories;

const emptyForm = {
  title: '',
  category: DEFAULT_CATEGORIES[0],
  price: '',
  description: '',
  image: '',
};

const CreateListing = ({ user, adminView = false }) => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [form, setForm] = useState(emptyForm);
  const [editingListing, setEditingListing] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url');
  const [imageFileName, setImageFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const canReview = user?.role === 'admin' || user?.role === 'moderator';

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
      setListings(await getListings());
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
        const [listingData, categoryData] = await Promise.all([
          getListings(),
          apiRequest('/categories').catch(() => []),
        ]);

        if (isMounted) {
          setListings(listingData);

          if (categoryData.length > 0) {
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
    setImageInputMode('url');
    setImageFileName('');
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
    setImageInputMode(listing.image?.startsWith('data:image') ? 'upload' : 'url');
    setImageFileName(listing.image?.startsWith('data:image') ? 'Uploaded image' : '');
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

  const handleImageModeChange = (mode) => {
    setImageInputMode(mode);
    setImageFileName('');
    setForm((current) => ({
      ...current,
      image: '',
    }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: reader.result,
      }));
      setImageFileName(file.name);
      setError('');
    };
    reader.onerror = () => setError('Could not read that image file.');
    reader.readAsDataURL(file);
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

    try {
      if (!payload.image) {
        throw new Error('Please add a product image.');
      }

      if (editingListing) {
        await updateListing(editingListing._id, payload);
      } else {
        await createListing(payload);
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

  const changeListingState = async (listing, listingState) => {
    setError('');
    setMessage('');

    try {
      await saveListingState(listing._id, listingState);
      setMessage(`Listing marked as ${listingState}.`);
      await loadListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await removeListing(listingToDelete._id);
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
      <nav className="mp-nav admin-nav">
        <Link to="/marketplace">
          <img src={logo} alt="StudentSlide" className="mp-nav-logo" />
        </Link>
        <div className="mp-nav-links">
          <Link to="/marketplace" className="mp-nav-link">MARKETPLACE</Link>
          <Link to="/listings" className={`mp-nav-link ${!adminView ? 'active' : ''}`}>MY LISTINGS</Link>
          {canReview && (
            <Link to="/admin/listings" className={`mp-nav-link ${adminView ? 'active' : ''}`}>ADMIN</Link>
          )}
        </div>
        <div className="mp-nav-right">
          <span className="admin-role-pill">{user?.role || 'guest'}</span>
        </div>
      </nav>

      <Container className="py-5">
        <div className="listing-toolbar">
          <div>
            <p className="listing-eyebrow">{adminView ? 'StudentSlide admin' : 'StudentSlide seller'}</p>
            <h1 className="listing-title">{adminView ? 'Listing Review Queue' : 'My Listings'}</h1>
            <p className="listing-subtitle">
              {adminView
                ? 'Review pending products, approve live listings, and clean up test data.'
                : 'Add products to MongoDB. New listings stay pending until an admin approves them.'}
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
                        {canReview && (
                          listing.listingState !== 'live' ? (
                            <Button size="sm" variant="outline-success" onClick={() => changeListingState(listing, 'live')}>
                              Approve
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline-secondary" onClick={() => changeListingState(listing, 'pending')}>
                              Unpublish
                            </Button>
                          )
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
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Product image</Form.Label>
                  <div className="listing-image-source">
                    <Form.Check
                      inline
                      type="radio"
                      name="imageSource"
                      id="image-source-url"
                      label="Image URL"
                      checked={imageInputMode === 'url'}
                      onChange={() => handleImageModeChange('url')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name="imageSource"
                      id="image-source-upload"
                      label="Upload image"
                      checked={imageInputMode === 'upload'}
                      onChange={() => handleImageModeChange('upload')}
                    />
                  </div>

                  {imageInputMode === 'url' ? (
                    <Form.Control
                      name="image"
                      type="url"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  ) : (
                    <Form.Control type="file" accept="image/*" onChange={handleImageFileChange} required={!form.image} />
                  )}
                </Form.Group>
              </Col>
              {form.image && (
                <Col xs={12}>
                  <div className="listing-image-preview">
                    <img src={form.image} alt="Listing preview" />
                    <div>
                      <strong>{imageFileName || 'Image preview'}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((current) => ({ ...current, image: '' }));
                          setImageFileName('');
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                </Col>
              )}
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
          <Button variant="danger" onClick={handleDeleteListing} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete listing'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateListing;
