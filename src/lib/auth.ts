export const createPasswordDigest = (password: string) => {
  let hash = 5381;
  const normalized = `local-demo:${password.trim()}`;

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 33) ^ normalized.charCodeAt(index);
  }

  return `demo-${(hash >>> 0).toString(36)}`;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
