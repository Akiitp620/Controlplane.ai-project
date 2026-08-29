'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (
      !name.trim() ||
      !email.trim() ||
      !company.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const text = await response.text();

      console.log('Register status:', response.status);
      console.log('Register response:', text);

      let data = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message || text || `Registration failed (${response.status})`
        );
      }

      if (!data) {
        throw new Error('Backend returned an empty response');
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create account'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02050a] text-white selection:bg-blue-500/30">
      {/* =========================================================
          BACKGROUND SYSTEM
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" />
        {/* Deep base */}
        <div className="absolute inset-0 bg-[#030914]" />

        {/* Primary atmosphere */}
       <div className="absolute left-1/2 top-[31%] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/[0.21] blur-[135px]" />

        {/* Secondary atmosphere */}
        <div className="absolute left-[20%] top-[48%] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.045] blur-[120px]" />

        <div className="absolute right-[14%] top-[52%] h-[340px] w-[340px] rounded-full bg-indigo-500/[0.045] blur-[120px]" />

        {/* Main technical grid */}
        <div
          className="
            absolute inset-0 opacity-[0.045]
            [background-image:
              linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),
              linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)
            ]
            [background-size:64px_64px]
          "
        />

        {/* Fine grid */}
        <div
          className="
            absolute inset-0 opacity-[0.018]
            [background-image:
              linear-gradient(rgba(59,130,246,0.35)_1px,transparent_1px),
              linear-gradient(90deg,rgba(59,130,246,0.35)_1px,transparent_1px)
            ]
            [background-size:16px_16px]
          "
        />

        {/* =====================================================
            RADAR / CONTROL RINGS
        ===================================================== */}
       <div className="absolute left-1/2 top-[50%] h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/[0.075]" />

        <div className="absolute left-1/2 top-[50%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/[0.095]" />

       <div className="absolute left-1/2 top-[50%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/[0.12]" />

       <div className="absolute left-1/2 top-[50%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.055]" />

        {/* Crosshair */}
        <div className="absolute left-1/2 top-[50%] h-px w-[760px] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/[0.16] to-transparent" />

       <div className="absolute left-1/2 top-[50%] h-[760px] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-blue-500/[0.13] to-transparent" />

        {/* Central signal */}
        <div className="absolute left-1/2 top-[50%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.9)]" />

        {/* =====================================================
            SIGNAL POINTS
        ===================================================== */}
        <span className="absolute left-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.7)]" />

        <span className="absolute left-[28%] top-[38%] h-1 w-1 rounded-full bg-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />

        <span className="absolute right-[24%] top-[25%] h-1.5 w-1.5 rounded-full bg-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.7)]" />

        <span className="absolute right-[18%] top-[40%] h-1 w-1 rounded-full bg-cyan-400/60 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />

        <span className="absolute left-[22%] bottom-[26%] h-1 w-1 rounded-full bg-blue-400/60" />

        <span className="absolute right-[27%] bottom-[23%] h-1.5 w-1.5 rounded-full bg-blue-400/70 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />

        {/* =====================================================
            SIDE ANNOTATIONS
        ===================================================== */}
        <div className="absolute left-[10%] top-[43%] hidden text-[10px] font-medium uppercase tracking-[0.18em] text-blue-400/75 xl:block">

       <div className="absolute left-[10%] top-[47%] hidden space-y-2 text-[10px] text-white/35 xl:block">
          <div>Context</div>
          <div>Risk</div>
          <div>Evidence</div>
          <div>Policy</div>
          <div>Decision</div>
        </div>

      <div className="absolute right-[9%] top-[49%] hidden text-right xl:block">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-blue-400/75">
            RESPONSIBLE AI
          </div>

         <div className="mt-3 space-y-2 text-[10px] text-white/35">
            <div>Monitor</div>
            <div>Evaluate</div>
            <div>Review</div>
            <div>Control</div>
          </div>
        </div>

        {/* =====================================================
            DATA WAVE — LOW OPACITY
        ===================================================== */}
        <div className="absolute inset-x-0 bottom-[-5px] opacity-75">
          <svg
            viewBox="0 0 1600 420"
            className="h-[320px] w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="waveBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M0 300 C180 250 260 370 430 290 S720 240 860 300 S1160 370 1300 280 S1490 240 1600 280"
              fill="none"
              stroke="url(#waveBlue)"
              strokeWidth="3"
            />

            <path
              d="M0 330 C170 280 270 390 450 315 S740 270 890 330 S1170 395 1320 305 S1500 275 1600 315"
              fill="none"
              stroke="url(#waveBlue)"
              strokeWidth="1.5"
              opacity="0.7"
            />

            <path
              d="M0 360 C180 310 290 410 470 340 S760 300 910 355 S1190 415 1350 330 S1510 310 1600 345"
              fill="none"
              stroke="url(#waveBlue)"
              strokeWidth="1"
              opacity="0.45"
            />

            {Array.from({ length: 80 }).map((_, index) => {
              const x = index * 20;
              const y = 300 + Math.sin(index * 0.62) * 32;

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={index % 4 === 0 ? 1.7 : 1}
                  fill="#3b82f6"
                  opacity={index % 5 === 0 ? 0.75 : 0.28}
                />
              );
            })}
          </svg>
        </div>

        {/* Bottom floor grid */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-[220px]
            opacity-[0.11]
            [background-image:
              linear-gradient(rgba(59,130,246,0.18)_1px,transparent_1px),
              linear-gradient(90deg,rgba(59,130,246,0.18)_1px,transparent_1px)
            ]
            [background-size:40px_40px]
            [mask-image:linear-gradient(to_bottom,transparent,black)]
          "
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.42)_100%)]" />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#02050a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight">
                ControlPlane
                <span className="text-blue-400">.ai</span>
              </div>

              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-white/35">
                Responsible AI Control
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden text-white/30 sm:inline">
              Already have an account?
            </span>

            <Link
              href="/login"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
       <section className="relative w-full max-w-[470px]">
          {/* =====================================================
              CARD AURA
          ===================================================== */}
          <div className="pointer-events-none absolute -inset-12 -z-10 rounded-[50px] bg-blue-500/[0.18] blur-[80px]" />

          <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[36px] bg-cyan-400/[0.05] blur-3xl" />

          {/* =====================================================
              REGISTER CARD
          ===================================================== */}
          <div
            className="
              group relative rounded-[24px]
             border border-blue-200/[0.16]
             bg-[#0b1422]/92
              p-8
             shadow-[0_30px_100px_rgba(37,99,235,0.18)]
              backdrop-blur-2xl
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-blue-400/35
              hover:shadow-[0_35px_110px_rgba(37,99,235,0.28)]
              sm:p-9
            "
          >
            {/* Card top highlight */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            {/* =================================================
                CARD HEADER
            ================================================= */}
            <div className="text-center">
              <div
                className="
                  mx-auto flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  border border-blue-400/20
                  bg-blue-400/[0.07]
                  text-blue-300
                  shadow-[0_0_24px_rgba(59,130,246,0.10)]
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:border-blue-400/35
                  group-hover:bg-blue-400/[0.10]
                  group-hover:shadow-[0_0_30px_rgba(59,130,246,0.20)]
                "
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[28px]">
                Create your account
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
                Create a workspace and start controlling AI decisions.
              </p>
            </div>

            {/* =================================================
                FORM ERROR
            ================================================= */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-3.5 py-3 text-xs leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Full name */}
              <Field
                id="name"
                label="Full name"
                placeholder="Your full name"
                type="text"
                value={name}
                onChange={setName}
                autoComplete="name"
                icon={UserRound}
              />

              {/* Work email */}
              <Field
                id="email"
                label="Work email"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                icon={Mail}
              />

              {/* Organization */}
              <Field
                id="company"
                label="Organization"
                placeholder="Company or organization"
                type="text"
                value={company}
                onChange={setCompany}
                autoComplete="organization"
                icon={Building2}
              />

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="
                      h-11 w-full rounded-xl
                      border border-white/[0.09]
                      bg-white/[0.025]
                      px-3.5 pr-11
                      text-sm text-white
                      outline-none
                      transition-all
                      placeholder:text-white/20
                      hover:border-white/[0.14]
                      focus:border-blue-400
                      focus:bg-white/[0.035]
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-white/25">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? 'text' : 'password'
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="
                      h-11 w-full rounded-xl
                      border border-white/[0.09]
                      bg-white/[0.025]
                      px-3.5 pr-11
                      text-sm text-white
                      outline-none
                      transition-all
                      placeholder:text-white/20
                      hover:border-white/[0.14]
                      focus:border-blue-400
                      focus:bg-white/[0.035]
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirmation password'
                        : 'Show confirmation password'
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[11px] leading-5 text-white/35">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.03] text-blue-600 focus:ring-blue-500"
                />

                <span>
                  I agree to the ControlPlane terms and understand
                  that this prototype uses demo authentication.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group/submit mt-2 flex h-11 w-full items-center
                  justify-center gap-2 rounded-xl
                  bg-gradient-to-r from-blue-600 to-blue-500
                  px-4
                  text-sm font-semibold text-white
                  shadow-[0_12px_30px_rgba(37,99,235,0.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:from-blue-500
                  hover:to-cyan-500
                  hover:shadow-[0_16px_35px_rgba(37,99,235,0.34)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
                "
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/submit:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                SECURITY
            ================================================= */}
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <div className="flex items-start gap-2.5">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/75" />

                <div>
                  <p className="text-[11px] font-medium text-white/50">
                    Protected workspace
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/25">
                    ControlPlane security controls protect your workspace.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                LOGIN LINK
            ================================================= */}
            <p className="mt-6 text-center text-xs text-white/30">
              Already registered?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ===============================================================
   INPUT FIELD
================================================================ */

function Field({
  id,
  label,
  placeholder,
  type,
  value,
  onChange,
  autoComplete,
  icon: Icon,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold text-white/70"
      >
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="
            h-11 w-full rounded-xl
            border border-white/[0.09]
            bg-white/[0.025]
            pl-10 pr-3.5
            text-sm text-white
            outline-none
            transition-all
            placeholder:text-white/20
            hover:border-white/[0.14]
            focus:border-blue-400
            focus:bg-white/[0.035]
            focus:ring-4
            focus:ring-blue-500/10
          "
        />
      </div>
    </div>
  );
}