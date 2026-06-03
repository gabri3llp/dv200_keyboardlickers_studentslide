import { sampleListings } from './sampleListings';

const TRADE_MESSAGES_KEY = 'studentslide_demo_trade_messages';
const TRADE_OFFER_LISTINGS_KEY = 'studentslide_demo_offer_listings';

export const TRADE_MESSAGES_UPDATED = 'studentslide-trade-messages-updated';

const normaliseListing = (listing) => ({
  _id: listing._id || listing.id || `demo-${Date.now()}`,
  title: listing.title,
  category: listing.category || 'Other',
  price: Number(listing.price) || 0,
  image: listing.image || listing.img || '',
  description: listing.description || '',
  sellerName: listing.sellerName || 'Student seller',
});

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getDemoTradeMessages = () => readJson(TRADE_MESSAGES_KEY);

export const getDemoOfferListings = (currentListingId) => {
  const rememberedListings = readJson(TRADE_OFFER_LISTINGS_KEY);
  const fallbackListings = sampleListings.slice(0, 3);
  const listings = rememberedListings.length > 0 ? rememberedListings : fallbackListings;

  return listings
    .map(normaliseListing)
    .filter((listing) => listing._id !== currentListingId);
};

export const rememberDemoOfferListing = (listing) => {
  const normalised = normaliseListing(listing);
  const existing = readJson(TRADE_OFFER_LISTINGS_KEY);
  const withoutDuplicate = existing.filter((item) => item._id !== normalised._id);

  writeJson(TRADE_OFFER_LISTINGS_KEY, [normalised, ...withoutDuplicate].slice(0, 6));
};

export const createDemoTradeMessage = ({ requestedListing, offeredListing, user }) => {
  const requested = normaliseListing(requestedListing);
  const offered = normaliseListing(offeredListing);
  const message = `Want to trade my ${offered.title} for your ${requested.title}?`;
  const now = new Date();

  const chat = {
    id: `trade-${now.getTime()}`,
    name: requested.sellerName || 'Student seller',
    preview: message,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'trades',
    messages: [
      {
        from: 'me',
        text: message,
      },
    ],
    trade: {
      status: 'pending',
      requestedListing: requested,
      offeredListing: offered,
      requestedBy: user?.email || user?.name || 'Student buyer',
    },
  };

  writeJson(TRADE_MESSAGES_KEY, [chat, ...getDemoTradeMessages()].slice(0, 12));
  window.dispatchEvent(new Event(TRADE_MESSAGES_UPDATED));

  return chat;
};
