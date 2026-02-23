'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Phone, Headphones, MessageCircle } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { EnrollModal } from './EmptyLoginForm';
import { subscribeFooterSettings } from '@/lib/getFooterSettings';

type Course = { id: number; title: string };

function UnifiedHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState(
    'https://wa.me/919182617094?text=Hi%2C%20I%20need%20more%20information%20about%20the%20courses.'
  );
  const [contactPhone, setContactPhone] = useState('+91 9182617094');
  const [courses, setCourses] = useState<Course[]>([]);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const message = 'Hi, I need more information about the courses.';

  /* --------------------------------
     WhatsApp URL formatter
  -------------------------------- */
  const formatWhatsAppUrl = useCallback(
    (whatsappLink: string): string => {
      if (!whatsappLink || whatsappLink === '#') return '';

      if (whatsappLink.startsWith('https://wa.me/')) {
        return whatsappLink.includes('?text=')
          ? whatsappLink
          : `${whatsappLink}?text=${encodeURIComponent(message)}`;
      }

      const phone = whatsappLink.replace(/\D/g, '');
      return phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        : '';
    },
    [message]
  );

  /* --------------------------------
     Subscribe to footer settings (NO FETCH)
  -------------------------------- */
  useEffect(() => {
    return subscribeFooterSettings((footerData) => {
      if (!footerData) return;

      if (footerData?.social_links?.whatsapp) {
        const url = formatWhatsAppUrl(
          footerData.social_links.whatsapp
        );
        if (url) setWhatsappUrl(url);
      }

      if (footerData?.contact_details?.phone) {
        setContactPhone(footerData.contact_details.phone);
      }
    });
  }, [formatWhatsAppUrl]);

  /* --------------------------------
     Fetch courses (KEEP this)
  -------------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourses() {
      try {
        const { getApiUrl } = await import('@/lib/apiConfig');
        const apiUrl = getApiUrl('/courses');
        if (!apiUrl) return;

        const res = await fetch(apiUrl, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) return;

        const response = await res.json();
        const data =
          response?.data || response?.courses || response || [];

        const list = Array.isArray(data)
          ? data
              .map((c: any) => ({
                id: c.id || c.course_id,
                title: c.title || c.course_name,
              }))
              .filter(Boolean)
          : [];

        setCourses(list);
      } catch {
        // silent
      }
    }

    fetchCourses();
    return () => controller.abort();
  }, []);

  /* --------------------------------
     Hide FAB near footer
  -------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      const d =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setHideButton(d < 200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* --------------------------------
     Lock body scroll
  -------------------------------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const phoneForCall = contactPhone.replace(/\D+/g, '');

  return (
    <>
      {/* FAB */}
      <div
        className={`sm:hidden fixed right-4 bottom-36 z-50 transition-all
          ${hideButton ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#1E5BA8] to-[#2563EB]
            text-white px-5 py-4 rounded-full shadow-xl flex items-center gap-2"
        >
          <Headphones /> Need Help?
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-[60]
          bg-white rounded-t-3xl transition-transform
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="p-4 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex gap-3 p-3 bg-green-50 rounded-xl"
          >
            <MessageCircle /> WhatsApp Chat
          </a>

          <button
            onClick={() => {
              setIsOpen(false);
              setShowEnquiryForm(true);
            }}
            className="flex gap-3 p-3 bg-blue-50 rounded-xl w-full"
          >
            <MessageSquare /> Get Callback
          </button>

          {phoneForCall && (
            <a
              href={`tel:${phoneForCall}`}
              onClick={() => setIsOpen(false)}
              className="flex gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <Phone /> Call Us
            </a>
          )}
        </div>
      </div>

      {showEnquiryForm && (
        <EnrollModal
          courses={courses}
          page="Unified Help Button"
          onClose={() => setShowEnquiryForm(false)}
        />
      )}
    </>
  );
}

export default memo(UnifiedHelpButton);
