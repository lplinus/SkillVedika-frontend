'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { useEffect, useState, useCallback, memo } from 'react';
import { subscribeFooterSettings } from '@/lib/getFooterSettings';

function WhatsAppButton() {
  const [whatsappUrl, setWhatsappUrl] = useState(
    'https://wa.me/919182617094?text=Hi%2C%20I%20need%20more%20information%20about%20the%20courses.'
  );

  const message = 'Hi, I need more information about the courses.';

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
     Subscribe ONCE – NO LOGS
  -------------------------------- */
  useEffect(() => {
    return subscribeFooterSettings((footerData) => {
      if (!footerData?.social_links?.whatsapp) return;

      const formatted = formatWhatsAppUrl(
        footerData.social_links.whatsapp
      );

      if (formatted) setWhatsappUrl(formatted);
    });
  }, [formatWhatsAppUrl]);

  return (
    <aside
      className="hidden md:block fixed right-24 bottom-14 z-50"
      aria-label="WhatsApp contact"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          bg-green-500 hover:bg-green-600
          rounded-full shadow-xl
          w-12 h-12
          flex items-center justify-center
          transition-all hover:scale-110 active:scale-95
        "
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6 text-white" />
      </a>
    </aside>
  );
}

export default memo(WhatsAppButton);
