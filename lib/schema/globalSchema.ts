// export function getGlobalSchema() {
//   return [
//     {
//       '@context': 'https://schema.org',
//       '@type': 'Organization',
//       name: 'SkillVedika',
//       url: 'https://skillvedika.com',
//       logo: 'https://skillvedika.com/skillvedika-logo.webp',
//       sameAs: [
//         'https://www.instagram.com/skillvedika',
//         'https://www.linkedin.com/company/skillvedika',
//       ],
//     },
//     {
//       '@context': 'https://schema.org',
//       '@type': 'WebSite',
//       name: 'SkillVedika',
//       url: 'https://skillvedika.com',
//       potentialAction: {
//         '@type': 'SearchAction',
//         target: 'https://skillvedika.com/courses?search={search_term_string}',
//         'query-input': 'required name=search_term_string',
//       },
//     },
//   ];
// }


export function getGlobalSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://skillvedika.com/#organization',
      name: 'SkillVedika',
      url: 'https://skillvedika.com',
      logo: 'https://skillvedika.com/skillvedika-logo.webp',
      description:
        'SkillVedika offers industry-ready online courses, corporate training, and job support programs designed to help professionals grow their careers in IT and technology.',
      sameAs: [
        'https://www.instagram.com/skillvedika',
        'https://www.linkedin.com/company/skillvedika',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://skillvedika.com/#website',
      name: 'SkillVedika',
      url: 'https://skillvedika.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://skillvedika.com/courses?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}