
const API_BASE = 'https://zomato-clone-api-5e4m.onrender.com';

export function resolveImageUrl(img) {
  if (!img || img.trim() === '') return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return `${API_BASE}${img}`;
  
  return `${API_BASE}/uploads/${img}`;
}
