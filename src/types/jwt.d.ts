export interface JwtPayload {
  sub: string; // The user ID or other unique identifier (e.g., user ID or email)
  iat?: number; // Issued At timestamp (optional, it's usually added automatically)
  exp?: number; // Expiration timestamp (optional, it's usually added automatically)
}
