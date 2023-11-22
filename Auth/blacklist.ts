// Acá agregamos el token a la lista negra (cuando se hace Logout)
const tokenBlacklist = new Set<string>()

function addToBlacklist(token: string): void {
  tokenBlacklist.add(token)
}

function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}

export { addToBlacklist, isTokenBlacklisted }
