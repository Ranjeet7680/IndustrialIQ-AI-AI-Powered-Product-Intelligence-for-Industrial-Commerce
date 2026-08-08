"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, PrecisionManufacturing, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  onSuccess: () => void;
}

export default function AuthView({ onSuccess }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('ranjeet@industrialiq.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Ranjeet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="h-full min-h-screen bg-surface-container-lowest text-on-surface font-body-md flex">
      {/* Left Side Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-container relative flex-col justify-between overflow-hidden p-12 text-on-primary">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-NsXVxb42U0vZcjBVgTVfJKnmOlBtrdYn1VYl1y94a3XbMrYpSCrMizIn1fKzwEUQR9te5VzPsfY3fOjDEz3Tn0Q5DoWCm8EYwQTMd6CAquOZukCSOLaa8WEDaXCraDc2gP6W3-TtAnlnV-lTafy6wdWSnlRI6-Dsm-DqIPZRbbpuEHR4hxPIsqsI2D-UxTbmD7BLuYiOu-3kyyDEbGHVi6coKUZdcfpfo7cpERiO2FgFcHkZFxd7Ug"
            alt="Industrial Facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <PrecisionManufacturing className="text-secondary-fixed" size={32} />
            <span className="font-headline-md text-headline-md font-bold">InduIntel</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display-lg text-display-lg text-on-primary mb-4 font-bold">
            Master Your Supply Chain with AI.
          </h1>
          <p className="font-body-md text-body-md text-secondary-fixed-dim leading-relaxed">
            Leverage predictive intelligence to optimize procurement, manage supplier risk, and streamline enterprise operations with unprecedented clarity.
          </p>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-surface-container-lowest z-10 relative">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
              {isSignUp ? 'Create enterprise account' : 'Sign in to your account'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {isSignUp ? 'Set up your operational intelligence workspace.' : 'Enter your details to access the intelligence platform.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface text-sm focus:border-secondary outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface text-sm focus:border-secondary outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface text-sm focus:border-secondary outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary-container" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-secondary font-medium hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary-container text-on-primary font-medium rounded hover:bg-primary transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-on-surface-variant">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-secondary font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
