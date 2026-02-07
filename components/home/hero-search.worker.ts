/* =========================
   INDUSTRY SKILLS (HEAVY)
========================= */

export const INDUSTRY_SKILLS: string[] = [
  'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud', 'GCP',
  'Cloud Computing', 'DevOps', 'Docker', 'Kubernetes',
  'Python', 'JavaScript', 'TypeScript', 'Java', 'PHP', 'PHP Laravel',
  'React', 'Next.js', 'Angular', 'Vue.js',
  'Data Science', 'Machine Learning', 'Deep Learning',
  'Cybersecurity', 'Ethical Hacking',
  'Salesforce', 'Salesforce Admin', 'Salesforce Developer',
];

/* =========================
   SKILL ALIASES
========================= */

const SKILL_ALIASES: Record<string, string> = {
  ml: 'machine learning',
  ai: 'artificial intelligence',
  dl: 'deep learning',
  ds: 'data science',
  gcp: 'google cloud',
  reactjs: 'react',
  nextjs: 'next.js',
  node: 'node.js',
  laravel: 'php laravel',
};

/* =========================
   LEVENSHTEIN (SAFE + FAST)
========================= */

const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,        // deletion
        curr[j - 1] + 1,    // insertion
        prev[j - 1] + cost  // substitution
      );
    }

    // swap arrays
    for (let j = 0; j <= b.length; j++) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
};

/* =========================
   RANKING FUNCTION (EXPORT)
========================= */

export const rankSkills = async (
  skills: string[],
  query?: string
): Promise<string[]> => {
  const q = (query ?? '').trim().toLowerCase();

  if (!q) return skills.slice(0, 15);

  if (SKILL_ALIASES[q]) {
    return rankSkills(skills, SKILL_ALIASES[q]);
  }

  return skills
    .map(skill => {
      const s = skill.toLowerCase();
      let score = 0;

      if (s.startsWith(q)) score += 100;
      if (s.includes(q)) score += 60;

      score += Math.max(0, 40 - levenshtein(q, s));

      return { skill, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(x => x.skill);
};

