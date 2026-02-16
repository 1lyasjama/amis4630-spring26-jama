# Database Schema (ERD)

## Main Tables

- User
- Listing
- Category
- ListingImage
- Review
- MessageThread
- Message
- Favorite
- Cart
- CartItem

## Relationships

User (1) → (Many) Listing  
User (1) → (Many) Review  
Listing (1) → (Many) ListingImage  
Listing (1) → (Many) Review  
Category (1) → (Many) Listing  
MessageThread (1) → (Many) Message  
Cart (1) → (Many) CartItem  

## How This Supports User Stories

Trust:
User tied to verified login.

Clear Listings:
Listing + ListingImage supports photos.

Communication:
MessageThread + Message supports coordination.

Accountability:
Review supports ratings.
