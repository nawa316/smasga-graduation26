const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';

export const siteConfig = {
  title: 'SMAN 1 Tenggarang Graduation 2026',
  description: 'A website for SMAN 1 Tenggarang Graduation 2026',
  url: siteUrl,
};
