// 'use client';

// import { useEffect, useState } from 'react';
// import { EnrollModal } from './EmptyLoginForm';
// import { subscribeFooterSettings } from '@/lib/getFooterSettings';

// type Course = { id: number; title: string };

// export default function StickyFooter() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [contactDetails, setContactDetails] = useState<{
//     phone?: string;
//     phoneUS?: string;
//     email?: string;
//   }>({
//     phone: '+91 8790536265',
//     phoneUS: '+1 972 945 0286',
//     email: 'support@skillvedika.com',
//   });

//   /* --------------------------------
//      Fetch Courses (unchanged)
//   -------------------------------- */
//   async function fetchCourses(apiUrl: string): Promise<void> {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);

//       const coursesRes = await fetch(`${apiUrl}/courses`, {
//         signal: controller.signal,
//         headers: { Accept: 'application/json' },
//       });

//       clearTimeout(timeoutId);

//       if (!coursesRes.ok) return;

//       const coursesResponse = await coursesRes.json();

//       let coursesData: any[] = [];
//       if (Array.isArray(coursesResponse)) {
//         coursesData = coursesResponse;
//       } else if (Array.isArray(coursesResponse?.data)) {
//         coursesData = coursesResponse.data;
//       } else if (Array.isArray(coursesResponse?.courses)) {
//         coursesData = coursesResponse.courses;
//       }

//       const courseList = coursesData
//         .map((course: any) => ({
//           id: course.id || course.course_id || 0,
//           title: course.title || course.course_name || '',
//         }))
//         .filter((c: any) => c.id && c.title);

//       setCourses(courseList);
//     } catch {
//       // silent fail – UI should never break
//     }
//   }

//   /* --------------------------------
//      Fetch Courses once
//   -------------------------------- */
//   useEffect(() => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     if (!apiUrl) return;
//     fetchCourses(apiUrl);
//   }, []);

//   /* --------------------------------
//      Subscribe to Footer Settings (NEW)
//   -------------------------------- */
//   useEffect(() => {
//     return subscribeFooterSettings((footerData) => {
//       if (!footerData?.contact_details) return;

//       setContactDetails({
//         phone: footerData.contact_details.phone,
//         phoneUS: footerData.contact_details.phone_us,
//         email: footerData.contact_details.email,
//       });
//     });
//   }, []);

//   /* --------------------------------
//      Phone formatting
//   -------------------------------- */
//   const phoneForCall = contactDetails.phone
//     ? contactDetails.phone.replaceAll(/\s+/g, '').replaceAll(/[^\d+]/g, '')
//     : '';

//   const phoneUSForCall = contactDetails.phoneUS
//     ? contactDetails.phoneUS.replaceAll(/\s+/g, '').replaceAll(/[^\d+]/g, '')
//     : '';

//   return (
//     <>
//       {/* Desktop Sticky Footer */}
//       <div
//         className="hidden md:block fixed left-0 bottom-0 w-full z-40 safe-area-inset-bottom"
//         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
//       >
//         <div className="bg-gray-100 border-t border-gray-300">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-700">

//             {/* Contact Info */}
//             <div className="flex items-center gap-3 flex-wrap">
//               <b>For Assistance Contact:</b>

//               {contactDetails.phoneUS && (
//                 <a href={`tel:${phoneUSForCall}`} className="flex items-center gap-1.5 hover:text-blue-600">
//                   <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-3.5" />
//                   <b>{contactDetails.phoneUS}</b>
//                 </a>
//               )}

//               {contactDetails.phoneUS && contactDetails.phone && <span>|</span>}

//               {contactDetails.phone && (
//                 <a href={`tel:${phoneForCall}`} className="flex items-center gap-1.5 hover:text-blue-600">
//                   <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3.5" />
//                   <b>{contactDetails.phone}</b>
//                 </a>
//               )}

//               {(contactDetails.phone || contactDetails.phoneUS) && contactDetails.email && <span>|</span>}

//               {contactDetails.email && (
//                 <a href={`mailto:${contactDetails.email}`} className="hover:text-blue-600">
//                   <b>Email: {contactDetails.email}</b>
//                 </a>
//               )}
//             </div>

//             {/* CTA */}
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full transition"
//             >
//               Drop Us a Query
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <EnrollModal
//           courses={courses}
//           page="Sticky Footer"
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { EnrollModal } from './EmptyLoginForm';
import { subscribeFooterSettings } from '@/lib/getFooterSettings';

type Course = { id: number; title: string };

export default function StickyFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isHidden, setIsHidden] = useState(false);

  const [contactDetails, setContactDetails] = useState<{
    phone?: string;
    phoneUS?: string;
    email?: string;
  } | null>(null);

  /* --------------------------------
     Fetch Courses
  -------------------------------- */
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl}/courses`)
      .then(res => res.json())
      .then(data => {
        const list = (data?.data || data || [])
          .map((c: any) => ({
            id: c.id || c.course_id,
            title: c.title || c.course_name,
          }))
          .filter((c: any) => c.id && c.title);

        setCourses(list);
      })
      .catch(() => { });
  }, []);

  /* --------------------------------
     Subscribe Admin Footer Settings
  -------------------------------- */
  useEffect(() => {
    return subscribeFooterSettings((footerData) => {
      if (!footerData?.contact_details) return;

      setContactDetails({
        phone: footerData.contact_details.phone,
        phoneUS: footerData.contact_details.phone_us,
        email: footerData.contact_details.email,
      });
    });
  }, []);

  /* --------------------------------
     Hide sticky footer when site footer is visible
  -------------------------------- */
  useEffect(() => {
    const sentinel = document.getElementById('footer-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return; // ✅ TS + runtime safe
        setIsHidden(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px -120px 0px',
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  if (!contactDetails) return null;

  const phoneIN = contactDetails.phone?.replace(/[^\d+]/g, '');
  const phoneUS = contactDetails.phoneUS?.replace(/[^\d+]/g, '');

  return (
    <>
      {/* Sticky Footer (Desktop + Mobile) */}
      <div
        className={`fixed left-0 bottom-0 w-full z-40 transition-transform duration-300 ${isHidden ? 'translate-y-full' : 'translate-y-0'
          }`}
      >
        <div className="bg-gray-100 border-t border-gray-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-700">

            {/* Contact Info */}
            <div className="flex items-center gap-3 flex-wrap text-center md:text-left">
              <b>For Assistance Contact:</b>

              {contactDetails.phoneUS && (
                <a
                  href={`tel:${phoneUS}`}
                  className="flex items-center gap-1.5 hover:text-blue-600"
                >
                  <img
                    src="https://flagcdn.com/w20/us.png"
                    alt="US"
                    className="w-5 h-3.5"
                    loading="lazy"
                  />
                  <b>{contactDetails.phoneUS}</b>
                </a>
              )}

              {contactDetails.phoneUS && contactDetails.phone && <span>|</span>}

              {contactDetails.phone && (
                <a
                  href={`tel:${phoneIN}`}
                  className="flex items-center gap-1.5 hover:text-blue-600"
                >
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India"
                    className="w-5 h-3.5"
                    loading="lazy"
                  />
                  <b>{contactDetails.phone}</b>
                </a>
              )}

              {(contactDetails.phone || contactDetails.phoneUS) &&
                contactDetails.email && <span>|</span>}

              {contactDetails.email && (
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="hover:text-blue-600"
                >
                  <b>Email: {contactDetails.email}</b>
                </a>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full transition min-h-[44px]"
            >
              Drop Us a Query
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EnrollModal
          courses={courses}
          page="Sticky Footer"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
