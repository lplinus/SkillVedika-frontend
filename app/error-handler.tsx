// 'use client';

// import { useEffect } from 'react';

// export default function ErrorHandler() {
//   useEffect(() => {
//     const onUnhandledRejection = (event: PromiseRejectionEvent) => {
//       try {
//         if (event.reason === undefined || event.reason === null) {
//           event.preventDefault();
//           return;
//         }

//         let errorMessage = '';
//         let errorString = '';

//         try {
//           if (typeof event.reason === 'object' && event.reason !== null) {
//             errorMessage = event.reason.message || String(event.reason);
//           } else {
//             errorMessage = String(event.reason);
//           }
//           errorString = String(event.reason);
//         } catch {
//           event.preventDefault();
//           return;
//         }

//         if (
//           errorMessage.includes('message channel') ||
//           errorMessage.includes('asynchronous response') ||
//           errorMessage.includes('message channel closed') ||
//           errorMessage.includes('listener indicated an asynchronous response') ||
//           errorString.includes('message channel') ||
//           errorMessage.includes('chrome-extension://') ||
//           errorMessage.includes('moz-extension://') ||
//           errorMessage.includes('safari-extension://')
//         ) {
//           event.preventDefault();
//         }
//       } catch {
//         event.preventDefault();
//       }
//     };

//     const onWindowError = (event: ErrorEvent) => {
//       if (
//         event.message?.includes('message channel') ||
//         event.message?.includes('chrome-extension://') ||
//         event.message?.includes('moz-extension://') ||
//         event.message?.includes('safari-extension://')
//       ) {
//         event.preventDefault();
//       }
//     };

//     window.addEventListener('unhandledrejection', onUnhandledRejection);
//     window.addEventListener('error', onWindowError);

//     return () => {
//       window.removeEventListener('unhandledrejection', onUnhandledRejection);
//       window.removeEventListener('error', onWindowError);
//     };
//   }, []);

//   return null;
// }



'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        if (event.reason === undefined || event.reason === null) {
          event.preventDefault();
          return;
        }

        let errorMessage = '';
        let errorString = '';

        try {
          if (typeof event.reason === 'object' && event.reason !== null) {
            errorMessage = event.reason.message || String(event.reason);
          } else {
            errorMessage = String(event.reason);
          }
          errorString = String(event.reason);
        } catch {
          event.preventDefault();
          return;
        }

        if (
          errorMessage.includes('message channel') ||
          errorMessage.includes('asynchronous response') ||
          errorMessage.includes('message channel closed') ||
          errorMessage.includes('listener indicated an asynchronous response') ||
          errorString.includes('message channel') ||
          errorMessage.includes('chrome-extension://') ||
          errorMessage.includes('moz-extension://') ||
          errorMessage.includes('safari-extension://')
        ) {
          event.preventDefault();
        }
      } catch {
        event.preventDefault();
      }
    };

    const onWindowError = (event: ErrorEvent) => {
      if (
        event.message?.includes('message channel') ||
        event.message?.includes('chrome-extension://') ||
        event.message?.includes('moz-extension://') ||
        event.message?.includes('safari-extension://')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('error', onWindowError);

    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('error', onWindowError);
    };
  }, []);

  return null;
}