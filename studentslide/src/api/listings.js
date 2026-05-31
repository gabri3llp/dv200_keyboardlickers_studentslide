import { apiRequest } from './client';

export const getListings = (state) => {
  const query = state ? `?state=${encodeURIComponent(state)}` : '';
  return apiRequest(`/listings${query}`);
};

export const getListing = (id) => apiRequest(`/listings/${id}`);

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

export const updateListingState = (id, listingState) =>
  apiRequest(`/listings/${id}/state`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingState }),
  });

export const deleteListing = (id) =>
  apiRequest(`/listings/${id}`, {
    method: 'DELETE',
  });
