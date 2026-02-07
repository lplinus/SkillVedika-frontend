import { getApiUrl } from '@/lib/apiConfig';
import type { Course } from '@/types/api';

export async function getCourses(): Promise<Course[]> {
  try {
    const apiUrl = getApiUrl('/courses');

    const res = await fetch(apiUrl, {
      next: { revalidate: 300 }, // cache 5 minutes
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) return [];

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) return [];

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.success && Array.isArray(data.data)) return data.data;

    return [];
  } catch {
    return [];
  }
}
