import CourseCardsClient from './CourseCards.client';

interface CourseCardsServerProps {
  statusFilter: string;
}

export default function CourseCardsServer({ statusFilter }: CourseCardsServerProps) {
  // Server renders section shell only
  // Client handles fetch + animations (for now)
  return (
    <section className="py-16 bg-white">
      <CourseCardsClient statusFilter={statusFilter} />
    </section>
  );
}
