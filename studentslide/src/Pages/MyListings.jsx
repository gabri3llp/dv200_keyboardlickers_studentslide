import CreateListing from './createListing';

// Reuse Sell's themed editor so listing fields and validation stay consistent.
export default function MyListings(props) {
  return <CreateListing {...props} managementView />;
}
