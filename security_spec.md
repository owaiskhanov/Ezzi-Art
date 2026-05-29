# Security Spec

## Data Invariants
1. An order must belong to a specific user and only that user can read or modify it.
2. Orders must contain valid user IDs matching the authenticated user.
3. Status must be one of: 'pending', 'completed', 'cancelled'.
4. Timestamps must be valid server timestamps.
5. The imageUrl data might be long, but string sizes must be enforced to prevent DoS attacks. Wait, a base64 image could be large. We should cap `imageUrl` at 1048487 bytes (close to 1MB Firestore limit).
6. Config string could also be large, cap at 10000 chars.

## The "Dirty Dozen" Payloads
1. Create order with someone else's userId.
2. Create order without being logged in.
3. Fetch another user's order.
4. Modify an order's userId.
5. Create order with invalid status.
6. Create order with string too long for imageUrl (1.5MB).
7. Create order with missing config field.
8. Update order shifting it from 'completed' to 'pending'.
9. Add random extra fields to order ("ghost field").
10. Update 'createdAt' timestamp on an existing order.
11. Update order status without valid `updatedAt` server timestamp.
12. Create order without a server timestamp for `createdAt`.
