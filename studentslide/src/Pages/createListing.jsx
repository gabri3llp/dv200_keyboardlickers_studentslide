import { useEffect, useMemo, useState } from 'react';
import { Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import {
  createListing,
  deleteListing as removeListing,
  getMyListings,
  updateListing,
} from '../api/listings';
import Navbar from '../Component/navbar';
import Footer from '../Component/footer';
import { rememberDemoOfferListing } from '../data/demoTrades';
import { listingCategories } from '../data/sampleListings';

const DEFAULT_CATEGORIES = listingCategories;

const emptyForm = {
  title: '',
  category: DEFAULT_CATEGORIES[0],
  price: '',
  description: '',
  image: '',
};

const CreateListing = ({ user, onLogout, managementView = false }) => {
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
  const [loadError, setLoadError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const userId = user?._id;

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
    setLoadError('');

    try {
      setListings(await getMyListings());
    } catch (err) {
      setLoadError(err.message);
      setSessionExpired(err.status === 401);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!userId) {
        setLoading(false);
        setListings([]);
        return;
      }
      setLoading(true);
      setLoadError('');
      setSessionExpired(false);
      try {
        const [listingData, categoryData] = await Promise.all([
          getMyListings(),
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
          setListings([]);
          setLoadError(err.message);
          setSessionExpired(err.status === 401);
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
  }, [userId]);

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
        const createdListing = await createListing(payload);
        rememberDemoOfferListing({
          ...createdListing,
          sellerName: [user?.name, user?.surname].filter(Boolean).join(' ') || user?.email || 'You',
        });
      }

      setShowFormModal(false);
      setMessage(editingListing ? 'Changes saved and sent for review. Your listing will return to the marketplace once approved.' : 'Listing created and sent for review.');
      await loadListings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await removeListing(listingToDelete._id, listingToDelete.__v ?? 0);
      setListingToDelete(null);
      setMessage('Listing deleted successfully.');
      await loadListings();
    } catch (err) {
      setError(err.message);
      if (err.status === 404 || err.status === 409) {
        setListingToDelete(null);
        await loadListings();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ss-page ss-owned-listings">
      <Navbar isLoggedIn={Boolean(user)} user={user} onLogout={onLogout} />

      <main className="ss-main">
        <div className="ss-toolbar">
          <div>
            <p className="ss-eyebrow">StudentSlide seller</p>
            <h1 className="ss-title">
              {managementView ? <>My <span className="ss-gradient-text">Listings</span></> : <>Sell an <span className="ss-gradient-text">item</span></>}
            </h1>
            <p className="ss-subtitle">
              Manage the items you have listed. New listings and edits stay pending until a moderator approves them.
            </p>
          </div>

          <button type="button" className="ss-btn ss-btn--primary" onClick={openCreateModal} disabled={!user || sessionExpired}>
            + Add product
          </button>
        </div>

        {user && !loadError && !loading && <div className="ss-stats">
          <div className="ss-card ss-stat">
            <span>Total listings</span>
            <strong>{listings.length}</strong>
          </div>
          <div className="ss-card ss-stat">
            <span>Pending review</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="ss-card ss-stat">
            <span>Live marketplace</span>
            <strong>{liveCount}</strong>
          </div>
        </div>}

        {message && <div className="ss-alert" role="status">{message}</div>}
        {error && !showFormModal && <div className="ss-alert ss-alert--error" role="alert">{error}</div>}

        <div className="ss-card ss-panel">
          {!user || sessionExpired ? (
            <div className="ss-state">
              <h2>{sessionExpired ? 'Please sign in again' : 'Your listings belong to you'}</h2>
              <p>Sign in to create listings and manage the items linked to your account.</p>
              <Link to="/auth" className="ss-btn ss-btn--primary">Sign in</Link>
            </div>
          ) : loading ? (
            <div className="ss-state">
              <Spinner animation="border" size="sm" variant="info" />
              <span>Loading listings...</span>
            </div>
          ) : loadError ? (
            <div className="ss-state" role="alert">
              <h2>Could not load your listings</h2>
              <p>{loadError}</p>
              <button type="button" className="ss-btn ss-btn--ghost" onClick={loadListings}>Try again</button>
            </div>
          ) : listings.length === 0 ? (
            <div className="ss-state">
              <h2>No listings linked to your account yet</h2>
              <p>Add an item to get started. Older listings without a recorded seller need a moderator’s review.</p>
              <button type="button" className="ss-btn ss-btn--primary" onClick={openCreateModal}>
                + Add product
              </button>
            </div>
          ) : (
            <Table responsive hover className="ss-table">
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
                      <div className="ss-product">
                        <img src={listing.image} alt={listing.title} />
                        <div>
                          <strong>{listing.title}</strong>
                          <p>{listing.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{listing.category}</td>
                    <td>R {Number(listing.price).toFixed(2)}</td>
                    <td>
                      <span className={`ss-badge ss-badge--${listing.listingState === 'live' ? 'live' : 'pending'}`}>
                        {listing.listingState}
                      </span>
                    </td>
                    <td>
                      <div className="ss-actions">
                        <button type="button" className="ss-btn ss-btn--ghost ss-btn--sm" onClick={() => openEditModal(listing)}>
                          Edit
                        </button>
                        <button type="button" className="ss-btn ss-btn--danger ss-btn--sm" onClick={() => setListingToDelete(listing)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </main>

      <Footer />

      <Modal show={showFormModal} onHide={closeFormModal} centered size="lg" contentClassName="ss-modal">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>{editingListing ? 'Edit listing' : 'Add product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <div className="ss-alert ss-alert--error" role="alert">{error}</div>}
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="ss-label">Product title</Form.Label>
                  <Form.Control className="ss-input" name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="ss-label">Price</Form.Label>
                  <Form.Control className="ss-input" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="ss-label">Category</Form.Label>
                  <Form.Select className="ss-input" name="category" value={form.category} onChange={handleChange} required>
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
                  <Form.Label className="ss-label">Product image</Form.Label>
                  <div className="d-flex gap-3 mb-2">
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
                      className="ss-input"
                      name="image"
                      type="url"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  ) : (
                    <Form.Control className="ss-input" type="file" accept="image/*" onChange={handleImageFileChange} required={!form.image} />
                  )}
                </Form.Group>
              </Col>
              {form.image && (
                <Col xs={12}>
                  <div className="ss-image-preview">
                    <img src={form.image} alt="Listing preview" />
                    <div>
                      <strong>{imageFileName || 'Image preview'}</strong>
                      <button
                        type="button"
                        className="ss-link-btn"
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
                  <Form.Label className="ss-label">Description</Form.Label>
                  <Form.Control
                    className="ss-input"
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
            <button type="button" className="ss-btn ss-btn--ghost" onClick={closeFormModal} disabled={saving}>
              Cancel
            </button>
            <button className="ss-btn ss-btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingListing ? 'Save changes' : 'Create listing'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={Boolean(listingToDelete)} onHide={() => !saving && setListingToDelete(null)} centered contentClassName="ss-modal">
        <Modal.Header closeButton={!saving}>
          <Modal.Title>Delete listing?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will remove <strong>{listingToDelete?.title}</strong> from the database.
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="ss-btn ss-btn--ghost" onClick={() => setListingToDelete(null)} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="ss-btn ss-btn--danger" onClick={handleDeleteListing} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete listing'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateListing;
