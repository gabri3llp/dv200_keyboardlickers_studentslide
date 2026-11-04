import { apiRequest } from './client';

export const getListings = (state) => {
  const query = state ? `?state=${encodeURIComponent(state)}` : '';
  return apiRequest(`/listings${query}`);
};

export const getListing = (id) => apiRequest(`/listings/${id}`);
export const getMyListings = () => apiRequest('/listings/mine');
export const getReviewListings = () => apiRequest('/listings/review');

export const createListing = (listing) =>
  apiRequest('/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });

export const updateListing = (id, listing) =>
  apiRequest(`/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });

export const updateListingState = (id, listingState, expectedVersion) =>
  apiRequest(`/listings/${id}/state`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingState, expectedVersion }),
  });

export const deleteListing = (id, expectedVersion) =>
  apiRequest(`/listings/${id}?expectedVersion=${encodeURIComponent(expectedVersion)}`, {
    method: 'DELETE',
  });
