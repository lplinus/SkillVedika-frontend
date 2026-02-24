'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

/* ✅ framer-motion loaded ONLY on client, after hydration */
const MotionDiv = dynamic(
  () => import('framer-motion').then(m => m.motion.div),
  { ssr: false }
);

const PhoneInput = dynamic(
  () => import('react-phone-input-2'),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50" />
    ),
  }
);

/* Country dropdown styles */
const phoneStyles = `
  .react-tel-input .country-list .country { color: #000 !important; }
  .react-tel-input .country-list .country .dial-code { color: #000 !important; }
  .react-tel-input .selected-flag .arrow { border-top-color: #000 !important; }
`;


export default function DemoSection({
  allCourses = [],
  target,
  title,
  subtitle,
  points = [],
  formDetails,
}: {
  allCourses: any[];
  target?: string;
  title?: { text?: string; part1?: string; part2?: string };
  subtitle?: string;
  points?: { title: string; description?: string }[];
  formDetails: any;
}) {
  /* -------------------------------------
     FORM STATE
  --------------------------------------*/
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fullPhone: '',
    countryCode: '+91',
    selectedCourses: [] as number[],
    terms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phoneReady, setPhoneReady] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      setPhoneReady(true);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  useEffect(() => {
    if (!phoneReady) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        import('react-phone-input-2/lib/style.css');
      });
    } else {
      timeoutId = setTimeout(() => {
        import('react-phone-input-2/lib/style.css');
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phoneReady]);


  const [searchTerm, setSearchTerm] = useState('');

  /* -------------------------------------
     DROPDOWN HANDLING
  --------------------------------------*/
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    function handleClick(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* -------------------------------------
     SUBMIT HANDLER
  --------------------------------------*/
  async function handleSubmit(e: any) {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // ---------------- EMAIL VALIDATION ----------------
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error('Please enter a valid email');
        return;
      }

      // ---------------- PHONE VALIDATION ----------------
      const digits = formData.fullPhone.replace(/\D/g, '');
      const cc = formData.countryCode.replace('+', '');
      const local = digits.replace(cc, '');

      if (local.length < 7 || local.length > 12) {
        toast.error('Enter a valid phone number (7–12 digits)');
        return;
      }

      if (formData.countryCode === '+91' && !/^[6-9][0-9]{9}$/.test(local)) {
        toast.error('Enter a valid Indian mobile number starting with 6–9');
        return;
      }

      if (!formData.selectedCourses.length) {
        toast.error('Please select at least one course');
        return;
      }

      // ---------------- CAPTCHA (v3) ----------------
      let captchaV3Token: string | null = null;

      try {
        const { load } = await import('recaptcha-v3');
        const recaptcha = await load(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!
        );
        captchaV3Token = await recaptcha.execute('contact_demo_submit');
      } catch (err) {
        console.warn('reCAPTCHA v3 failed or blocked', err);
      }

      // ---------------- API SUBMIT ----------------
      const api = process.env.NEXT_PUBLIC_API_URL;

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.fullPhone,
        courses: formData.selectedCourses,
        page: 'Contact Us',
      };

      if (captchaV3Token) payload.captcha_v3 = captchaV3Token;

      const res = await fetch(`${api}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || 'Submission failed');
        return;
      }

      toast.success(json.message || 'Submitted!');

      // setFormData({
      //   name: '',
      //   email: '',
      //   fullPhone: '',
      //   countryCode: '+91',
      //   selectedCourses: [],
      //   terms: true,
      // });
      setFormData({
        name: '',
        email: '',
        fullPhone: undefined as unknown as string,
        countryCode: '+91',
        selectedCourses: [],
        terms: true,
      });

    } catch (err) {
      console.error(err);
      toast.error('Error submitting form');
    } finally {
      setIsSubmitting(false); // ✅ ALWAYS runs
    }
  }


  /* -------------------------------------
     UI RENDER
  --------------------------------------*/
  return (
    // <section className="relative overflow-hidden bg-gradient-to-b from-[#F7FAFF] via-[#EEF3FB] to-blue-50 py-28 px-4 sm:px-6 lg:px-8">
    //   <style>{phoneStyles}</style>

    //   <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
    //     {/* LEFT SECTION */}
    //     <MotionDiv
    //       className="space-y-10"
    //       initial={{ opacity: 0, x: -40 }}
    //       whileInView={{ opacity: 1, x: 0 }}
    //       transition={{ duration: 0.8 }}
    //       viewport={{ once: true }}
    //     >
    //       {/* Target Label */}
    //       <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm shadow-sm">
    //         {target || '✨ Limited Spots Available'}
    //       </div>

    //       {/* Title */}
    //       {(() => {
    //         const hasParts = Boolean(
    //           (title?.part1 && title.part1.trim()) || (title?.part2 && title.part2.trim())
    //         );
    //         const main = hasParts
    //           ? (title?.part1 ?? title?.text ?? '')
    //           : (title?.text ?? 'Get a Live');
    //         const second = hasParts ? (title?.part2 ?? '') : '';

    //         return (
    //           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
    //             {main}{' '}
    //             {second ? (
    //               <span className="block bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
    //                 {second}
    //               </span>
    //             ) : null}
    //           </h2>
    //         );
    //       })()}

    //       {/* Subtitle */}
    //       <p className="text-lg text-gray-600 max-w-xl">
    //         {subtitle || 'Experience firsthand how SkillVedika can enhance your learning journey.'}
    //       </p>

    //       {/* Points List */}
    //       <ul className="space-y-6">
    //         {(points.length
    //           ? points
    //           : [
    //             {
    //               title: 'Explore Trending Courses',
    //               description: 'Discover in-demand courses designed by experts.',
    //             },
    //             {
    //               title: 'Flexible Learning Plans',
    //               description: 'Scholarships, EMI options & custom schedules.',
    //             },
    //             {
    //               title: 'Instant Access',
    //               description: 'Unlock webinars & recorded masterclasses.',
    //             },
    //           ]
    //         ).map((item, i) => (
    //           <MotionDiv
    //             key={i}
    //             className="flex items-start gap-4"
    //             initial={{ opacity: 0, y: 30 }}
    //             whileInView={{ opacity: 1, y: 0 }}
    //             transition={{ delay: i * 0.1 }}
    //           >
    //             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
    //               <CheckCircle2 className="w-6 h-6 text-blue-600" />
    //             </div>
    //             <div>
    //               <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
    //               <p className="text-gray-600">{item.description}</p>
    //             </div>
    //           </MotionDiv>
    //         ))}
    //       </ul>
    //     </MotionDiv>

    //     {/* RIGHT FORM SECTION */}
    //     <MotionDiv
    //       className="relative"
    //       initial={{ opacity: 0, x: 40 }}
    //       whileInView={{ opacity: 1, x: 0 }}
    //       transition={{ duration: 0.8, delay: 0.2 }}
    //       viewport={{ once: true }}
    //     >
    //       <div className="rounded-3xl p-[2px] bg-gradient-to-br from-blue-300/40 via-teal-200/30">
    //         <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-blue-100">
    //           {/* FORM HEADER */}
    //           <div className="text-center mb-10">
    //             <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
    //               {formDetails?.form_title || 'Book Your Free Demo'}
    //             </h3>
    //             {/*  before <p> */} <div className="text-gray-600 mt-2 flex items-center justify-center gap-2">
    //               {formDetails?.form_subtitle || 'Our team will contact you shortly.'}
    //               <MotionDiv
    //                 animate={{ rotate: [-20, 20, -20, 20, 0] }}
    //                 transition={{ duration: 1, repeat: Infinity }}
    //               >
    //                 <Bell className="w-6 h-6 text-yellow-500" />
    //               </MotionDiv>
    //             </div>    {/*  before </p> */}
    //           </div>

    //           {/* FORM */}
    //           <form className="space-y-6" onSubmit={handleSubmit}>
    //             {/* NAME */}
    //             <div className="space-y-2">
    //               <Label htmlFor="demo-name">{formDetails?.full_name_label || 'Full Name'}</Label>
    //               <Input
    //                 id="demo-name"
    //                 required
    //                 value={formData.name}
    //                 onChange={e => setFormData({ ...formData, name: e.target.value })}
    //                 placeholder={formDetails?.full_name_placeholder || 'Enter your full name'}
    //                 className="h-12 border border-blue-100"
    //               />
    //             </div>

    //             {/* EMAIL */}
    //             <div className="space-y-2">
    //               <Label htmlFor="demo-email">{formDetails?.email_label || 'Email Address'}</Label>
    //               <Input
    //                 id="demo-email"
    //                 required
    //                 type="email"
    //                 value={formData.email}
    //                 onChange={e => setFormData({ ...formData, email: e.target.value })}
    //                 placeholder={formDetails?.email_placeholder || 'you@example.com'}
    //                 className="h-12 border border-blue-100"
    //               />
    //             </div>

    //             {/* PHONE */}
    //             <div className="space-y-2">
    //               <Label htmlFor="demo-phone">{formDetails?.phone_label || 'Phone Number'}</Label>
    //               <div className="relative ">
    //                 {phoneReady && (
    //                   <PhoneInput
    //                     country="in"
    //                     value={formData.fullPhone}
    //                     countryCodeEditable={false}
    //                     // forceDialCode={true}
    //                     onChange={(value: any, country: any) =>
    //                       setFormData({
    //                         ...formData,
    //                         // fullPhone: '+' + value,
    //                         fullPhone: value,
    //                         countryCode: '+' + ((country as any)?.dialCode || ''),
    //                       })
    //                     }
    //                     inputProps={{ id: 'demo-phone', name: 'phone' }}
    //                     inputStyle={{
    //                       width: '100%',
    //                       height: '48px',
    //                       fontSize: '16px',
    //                     }}
    //                     buttonStyle={{ border: '1px solid #d1d5db' }}
    //                     containerStyle={{ width: '100%' }}
    //                   />
    //                 )}

    //                 {!formData.fullPhone && (
    //                   <span className="absolute left-[82px] inset-y-0 flex items-center text-gray-400 text-sm pointer-events-none">
    //                     {formDetails?.phone_placeholder || 'Enter phone number'}
    //                   </span>
    //                 )}
    //               </div>
    //             </div>

    //             {/* COURSE DROPDOWN */}
    //             <CourseDropdown
    //               dropdownRef={dropdownRef}
    //               open={open}
    //               setOpen={setOpen}
    //               allCourses={allCourses}
    //               selected={formData.selectedCourses}
    //               setSelected={(list: number[]) =>
    //                 setFormData({ ...formData, selectedCourses: list })
    //               }
    //               searchTerm={searchTerm}
    //               setSearchTerm={setSearchTerm}
    //               formDetails={formDetails}
    //             />

    //             {/* TERMS */}
    //             <div className="flex items-start gap-3">
    //               <Label className="flex items-start gap-3">
    //                 {/* <Checkbox
    //                   id="demo-terms"
    //                   checked={formData.terms}
    //                   onCheckedChange={v => setFormData({ ...formData, terms: !!v })}
    //                 /> */}
    //                 <Checkbox
    //                   id="corporate-terms"
    //                   checked={Boolean(formData.terms)}
    //                   onCheckedChange={v =>
    //                     setFormData({ ...formData, terms: !!v })
    //                   }
    //                   aria-label="Accept Terms and Conditions"
    //                   className="
    //                     border-blue-300
    //                     data-[state=checked]:bg-blue-800
    //                     data-[state=checked]:border-blue-800
    //                     data-[state=checked]:text-white
    //                   "
    //                 />
    //                 <span className="text-sm text-gray-600">
    //                   {formDetails?.terms_prefix || 'I agree to the'}{' '}
    //                   <a
    //                     className="text-blue-600 hover:underline"
    //                     href={formDetails?.terms_link || '/terms-and-conditions'}
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                   >
    //                     {formDetails?.terms_label || 'Terms & Conditions'}
    //                   </a>

    //                   .
    //                 </span>
    //               </Label>
    //             </div>

    //             <Button
    //               type="submit"
    //               disabled={isSubmitting}
    //               className="w-full h-14 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold flex items-center justify-center gap-2"
    //             >
    //               {isSubmitting ? (
    //                 <>
    //                   <Loader2 className="w-5 h-5 animate-spin" />
    //                   <span>Submitting...</span>
    //                 </>
    //               ) : (
    //                 <span>{formDetails?.submit_button_text || 'Submit Your Details'}</span>
    //               )}
    //             </Button>

    //             <p className="text-xs text-center text-gray-500">
    //               🔒 {formDetails?.form_footer_text || 'Your information is secure.'}
    //             </p>
    //           </form>
    //         </div>
    //       </div>
    //     </MotionDiv>
    //   </div>
    // </section>






    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7FAFF] via-[#EEF3FB] to-blue-50 py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
  <style>{phoneStyles}</style>

  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
    
    {/* LEFT SECTION */}
    <MotionDiv
      className="space-y-6 md:space-y-10 text-center lg:text-left flex flex-col items-center lg:items-start"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Target Label */}
      <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-xs sm:text-sm shadow-sm">
        {target || '✨ Limited Spots Available'}
      </div>

      {/* Title */}
      {(() => {
        const hasParts = Boolean(
          (title?.part1 && title.part1.trim()) || (title?.part2 && title.part2.trim())
        );
        const main = hasParts
          ? (title?.part1 ?? title?.text ?? '')
          : (title?.text ?? 'Get a Live');
        const second = hasParts ? (title?.part2 ?? '') : '';

        return (
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
            {main}{' '}
            {second ? (
              <span className="block lg:inline bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                {second}
              </span>
            ) : null}
          </h2>
        );
      })()}

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
        {subtitle || 'Experience firsthand how SkillVedika can enhance your learning journey.'}
      </p>

      {/* Points List */}
      <ul className="space-y-4 sm:space-y-6 w-full text-left">
        {(points.length
          ? points
          : [
            {
              title: 'Explore Trending Courses',
              description: 'Discover in-demand courses designed by experts.',
            },
            {
              title: 'Flexible Learning Plans',
              description: 'Scholarships, EMI options & custom schedules.',
            },
            {
              title: 'Instant Access',
              description: 'Unlock webinars & recorded masterclasses.',
            },
          ]
        ).map((item, i) => (
          <MotionDiv
            key={i}
            className="flex items-start gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-snug">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
            </div>
          </MotionDiv>
        ))}
      </ul>
    </MotionDiv>

    {/* RIGHT FORM SECTION */}
    <MotionDiv
      className="relative w-full max-w-xl mx-auto lg:max-w-none"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="rounded-[2rem] p-[1px] sm:p-[2px] bg-gradient-to-br from-blue-300/40 via-teal-200/30">
        <div className="bg-white/95 backdrop-blur-lg rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-100">
          {/* FORM HEADER */}
          <div className="text-center mb-6 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              {formDetails?.form_title || 'Book Your Free Demo'}
            </h3>
            <div className="text-gray-600 mt-2 flex items-center justify-center gap-2 text-sm sm:text-base">
              {formDetails?.form_subtitle || 'Our team will contact you shortly.'}
              <MotionDiv
                animate={{ rotate: [-20, 20, -20, 20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </MotionDiv>
            </div>
          </div>

          {/* FORM */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="demo-name" className="text-sm sm:text-base">{formDetails?.full_name_label || 'Full Name'}</Label>
              <Input
                id="demo-name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={formDetails?.full_name_placeholder || 'Enter your full name'}
                className="h-11 sm:h-12 border border-blue-100 text-sm sm:text-base"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="demo-email" className="text-sm sm:text-base">{formDetails?.email_label || 'Email Address'}</Label>
              <Input
                id="demo-email"
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder={formDetails?.email_placeholder || 'you@example.com'}
                className="h-11 sm:h-12 border border-blue-100 text-sm sm:text-base"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="demo-phone" className="text-sm sm:text-base">{formDetails?.phone_label || 'Phone Number'}</Label>
              <div className="relative">
                {phoneReady && (
                  <PhoneInput
                    country="in"
                    value={formData.fullPhone}
                    countryCodeEditable={false}
                    onChange={(value: any, country: any) =>
                      setFormData({
                        ...formData,
                        fullPhone: value,
                        countryCode: '+' + ((country as any)?.dialCode || ''),
                      })
                    }
                    inputProps={{ id: 'demo-phone', name: 'phone' }}
                    inputStyle={{
                      width: '100%',
                      height: '44px',
                      fontSize: '14px',
                    }}
                    buttonStyle={{ border: '1px solid #d1d5db', borderRadius: '8px 0 0 8px' }}
                    containerStyle={{ width: '100%' }}
                  />
                )}
                {!formData.fullPhone && (
                  <span className="absolute left-[82px] inset-y-0 flex items-center text-gray-400 text-xs sm:text-sm pointer-events-none">
                    {formDetails?.phone_placeholder || 'Enter phone number'}
                  </span>
                )}
              </div>
            </div>

            <CourseDropdown
              dropdownRef={dropdownRef}
              open={open}
              setOpen={setOpen}
              allCourses={allCourses}
              selected={formData.selectedCourses}
              setSelected={(list: number[]) =>
                setFormData({ ...formData, selectedCourses: list })
              }
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              formDetails={formDetails}
            />

            {/* TERMS */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="corporate-terms"
                checked={Boolean(formData.terms)}
                onCheckedChange={v => setFormData({ ...formData, terms: !!v })}
                className="mt-1 border-blue-300 data-[state=checked]:bg-blue-800"
              />
              <label htmlFor="corporate-terms" className="text-xs sm:text-sm text-gray-600 leading-tight">
                {formDetails?.terms_prefix || 'I agree to the'}{' '}
                <a className="text-blue-600 hover:underline" href={formDetails?.terms_link || '/terms-and-conditions'} target="_blank" rel="noopener noreferrer">
                  {formDetails?.terms_label || 'Terms & Conditions'}
                </a>.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-blue-200"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                formDetails?.submit_button_text || 'Submit Your Details'
              )}
            </Button>

            <p className="text-[10px] sm:text-xs text-center text-gray-500">
              🔒 {formDetails?.form_footer_text || 'Your information is secure.'}
            </p>
          </form>
        </div>
      </div>
    </MotionDiv>
  </div>
</section>
  );
}

/* -------------------------------------
   COURSE DROPDOWN COMPONENT
--------------------------------------*/
function CourseDropdown({
  dropdownRef,
  open,
  setOpen,
  allCourses,
  selected,
  setSelected,
  searchTerm,
  setSearchTerm,
  formDetails,
}: any) {
  // Ensure allCourses is always an array
  const coursesArray = Array.isArray(allCourses) ? allCourses : [];

  const filtered = coursesArray
    .filter((c: any) => c && !selected.includes(c.id))
    .filter((c: any) => c?.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative flex flex-col gap-2" ref={dropdownRef}>
      <Label>
        <span className="text-red-500">*</span> {formDetails?.course_label || 'Select Courses'}
      </Label>

      {/* Selected Chips */}
      <div
        className="w-full px-4 py-3 border border-blue-200 bg-white rounded-xl flex flex-wrap gap-2"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500">
            {formDetails?.course_placeholder || 'Choose courses'}
          </span>
        ) : (
          selected.map((id: number) => {
            const course = allCourses.find((c: any) => c.id === id);
            return (
              <span
                key={id}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                onClick={e => {
                  e.stopPropagation();
                  setSelected(selected.filter((x: number) => x !== id));
                }}
              >
                {course?.title}
                <span className="font-bold">×</span>
              </span>
            );
          })
        )}
      </div>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute left-0 top-[105%] w-full bg-white border rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
          <div className="p-2 sticky top-0 bg-white border-b">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 outline-none border rounded-lg"
            />
          </div>

          <div className="p-2">
            {filtered.map((c: any) => (
              <div
                key={c.id}
                className="px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => setSelected([...selected, c.id])}
              >
                {c.title}
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-4">No courses found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
