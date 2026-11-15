// Seller accounts are defined in .env: SELLER_EMAILS=a@x.com,b@y.com
export const isSellerEmail = (email) =>
  Boolean(email) &&
  (process.env.SELLER_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(String(email).toLowerCase());
