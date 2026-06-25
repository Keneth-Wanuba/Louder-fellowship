export type ThemeScriptureReference = {
  book: string;
  chapter: string;
  verses: string;
  display: string;
};

export type ThemeScripture = {
  reference: ThemeScriptureReference;
  text: string;
};

export type DevotionScriptureLike = {
  scripture?: string;
  themeScripture?: ThemeScripture;
};

export const buildScriptureReference = (reference: Partial<ThemeScriptureReference>) => {
  const book = String(reference.book ?? '').trim();
  const chapter = String(reference.chapter ?? '').trim();
  const verses = String(reference.verses ?? '').trim();
  const display = String(reference.display ?? '').trim();

  if (display) return display;
  if (book && chapter && verses) return `${book} ${chapter}:${verses}`;
  if (book && chapter) return `${book} ${chapter}`;
  return book;
};

export const formatThemeScripture = (devotion: DevotionScriptureLike) => {
  if (devotion.themeScripture) {
    const reference = buildScriptureReference(devotion.themeScripture.reference);
    return [devotion.themeScripture.text, reference].filter(Boolean).join('\n');
  }

  return devotion.scripture ?? '';
};

export const splitLegacyScripture = (scripture = ''): ThemeScripture => ({
  reference: {
    book: '',
    chapter: '',
    verses: '',
    display: '',
  },
  text: scripture,
});
