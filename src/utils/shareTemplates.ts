export interface DevotionLike {
  id: string;
  title: string;
  scripture?: string;
  content?: string;
  author?: string;
}

export interface TestimonyLike {
  id: string;
  author: string;
  location?: string;
  content: string;
  date?: string;
}

function truncate(text: string, max = 280) {
  if (!text) return '';
  return text.length > max ? text.substring(0, max - 3) + '...' : text;
}

export function generateDevotionShare(devotion: DevotionLike, origin = typeof window !== 'undefined' ? window.location.origin : 'https://louderfellowship.org') {
  const url = `${origin}/devotions`;
  const title = `Theme: ${devotion.title}`;
  const author = devotion.author ? `Author: ${devotion.author}` : '';
  const scripture = devotion.scripture ? `Scripture: ${devotion.scripture}` : '';
  const preview = devotion.content ? truncate(devotion.content, 400) : '';

  const full = `${title}\n${scripture ? scripture + '\n' : ''}${author ? author + '\n\n' : '\n'}${preview}\n\nRead more: ${url}`;
  const short = `${title} — ${devotion.scripture || ''} Read more: ${url}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(full)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(full)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncate(short, 240))}&url=${encodeURIComponent(url)}`,
    plain: full,
    short
  };
}

export function generateTestimonyShare(testimony: TestimonyLike, origin = typeof window !== 'undefined' ? window.location.origin : 'https://louderfellowship.org') {
  const url = `${origin}/testimonies`;
  const title = `Testimony from ${testimony.author}${testimony.location ? ' — ' + testimony.location : ''}`;
  const preview = truncate(`"${testimony.content}"`, 500);
  const full = `${title}\n\n${preview}\n\nRead more: ${url}`;
  const short = `${title} — ${truncate(testimony.content, 180)} Read more: ${url}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(full)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(full)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncate(short, 240))}&url=${encodeURIComponent(url)}`,
    plain: full,
    short
  };
}
