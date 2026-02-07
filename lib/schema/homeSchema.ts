export function getHomeSchema(seo?: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name:
      seo?.meta_title ||
      'SkillVedika – IT Training Institute',
    url: 'https://skillvedika.com/',
    description:
      seo?.meta_description ||
      'SkillVedika offers SAP, AWS DevOps, Salesforce & Data Science courses.',
    isPartOf: {
      '@id': 'https://skillvedika.com/#website',
    },
  };
}
