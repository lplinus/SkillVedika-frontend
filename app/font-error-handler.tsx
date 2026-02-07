// 'use client';

// import { useEffect } from 'react';

// export default function FontErrorHandler() {
//   useEffect(() => {
//     const originalError = console.error;

//     console.error = (...args: any[]) => {
//       const message = args.join(' ');
//       if (
//         typeof message === 'string' &&
//         (message.includes('/fonts/') ||
//           message.includes('KFOmCnqEu92Fr1Mu4mxK')) &&
//         (message.includes('404') ||
//           message.includes('Failed to load') ||
//           message.includes('ERR_ABORTED'))
//       ) {
//         return;
//       }
//       originalError.apply(console, args);
//     };

//     const onFontErrorCapture = (event: Event) => {
//       const target = event.target as HTMLElement | null;
//       if (
//         target &&
//         (target.tagName === 'LINK' || target.tagName === 'STYLE')
//       ) {
//         event.preventDefault();
//         event.stopPropagation();
//       }
//     };

//     window.addEventListener('error', onFontErrorCapture, true);

//     return () => {
//       console.error = originalError;
//       window.removeEventListener('error', onFontErrorCapture, true);
//     };
//   }, []);

//   return null;
// }

'use client';

import { useEffect } from 'react';

export default function FontErrorHandler() {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (
        typeof message === 'string' &&
        (message.includes('/fonts/') ||
          message.includes('KFOmCnqEu92Fr1Mu4mxK')) &&
        (message.includes('404') ||
          message.includes('Failed to load') ||
          message.includes('ERR_ABORTED'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    const onFontErrorCapture = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'LINK' || target.tagName === 'STYLE')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', onFontErrorCapture, true);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', onFontErrorCapture, true);
    };
  }, []);

  return null;
}