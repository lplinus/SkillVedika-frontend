export function getGlobalSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SkillVedika',
      url: 'https://skillvedika.com',
      logo: 'https://skillvedika.com/skillvedika-logo.webp',
      sameAs: [
        'https://www.instagram.com/skillvedika',
        'https://www.linkedin.com/company/skillvedika',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SkillVedika',
      url: 'https://skillvedika.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://skillvedika.com/courses?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}
