# Security Specification for Louder Fellowship

## Data Invariants
- A testimony must have a status of 'PENDING', 'APPROVED', or 'REJECTED'.
- A user-submitted testimony must initially be 'PENDING'.
- Comments must belong to a valid testimony ID.
- Only admins can change the status of a testimony.

## The "Dirty Dozen" Payloads

### Testimony Attacks
1. **Status Spoofing**: Attempting to create a testimony with `status: 'APPROVED'`. (Denied by `isValidTestimony` on create)
2. **Identity Spoofing**: Creating a testimony with a fake `id`. (Denied by `isValidId`)
3. **Privilege Escalation**: Attempting to update a testimony's `status` without admin auth. (Denied by `isAdmin` check)
4. **Field Injection**: Updating an approved testimony with extra "Ghost Fields". (Denied by `affectedKeys().hasOnly()`)
5. **PII Leak**: Reading `PENDING` testimonies as a non-admin. (Denied)
6. **Date Forgery**: Creating a testimony with a future/malformed `date`. (Strict size/format checks)

### Comment Attacks
7. **Orphaned Comment**: Creating a comment for a non-existent `testimonyId`. (Denied by `exists()`)
8. **Spam Payload**: Creating a comment with 1MB of text. (Denied by `.size()`)
9. **Author Spoofing**: Setting `author` to an Admin's name. (Self-assigned role check)
10. **Time Forgery**: Setting `createdAt` to a future date instead of `request.time`. (Denied by `request.time` check)
11. **Bulk Delete**: Attempting to delete multiple comments. (Denied - no delete rule for public)
12. **Comment Hijacking**: Updating someone else's comment content. (Denied - no update rule for comments)

## Test Runner (Simplified Concept)
The rules will be verified using the Emulator or ESLint as per the skill.
