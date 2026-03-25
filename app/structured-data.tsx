export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Digitale Analyse — Tijmen Berens Photography',
    description:
      'Uitgebreide digitale analyse van de online zichtbaarheid van National Geographic winnende fotograaf Tijmen Berens.',
    author: {
      '@type': 'Organization',
      name: 'AetherLink B.V.',
      url: 'https://aetherlink.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AetherLink B.V.',
    },
    datePublished: '2026-03-25',
    mainEntityOfPage: 'https://tijmen-berens-analyse.vercel.app/analyse',
    about: {
      '@type': 'Person',
      name: 'Tijmen Berens',
      jobTitle: 'Fotograaf',
      award: 'National Geographic Photo Contest Winner NL 2022',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
