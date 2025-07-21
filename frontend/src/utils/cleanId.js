export const cleanId = (id) => {
  if (!id) return null;
  return id.startsWith(':') ? id.slice(1) : id;
};