import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ROLES = [
  { value: 'PATIENT',               label: 'Patient' },
  { value: 'DOCTOR',                label: 'Doctor' },
  { value: 'NURSE',                 label: 'Nurse (Hospital)' },
  { value: 'INDEPENDENT_NURSE',     label: 'Independent Nurse' },
  { value: 'PHARMACIST',            label: 'Pharmacist' },
  { value: 'LAB_TECHNICIAN',        label: 'Lab Technician' },
  { value: 'PHLEBOTOMIST',          label: 'Phlebotomist' },
  { value: 'BLOOD_BANK_MANAGER',    label: 'Blood Bank Manager' },
  { value: 'AMBULANCE_OPERATOR',    label: 'Ambulance Operator' },
  { value: 'RECEPTIONIST',          label: 'Receptionist' },
  { value: 'MEDICAL_SHOP_OWNER',    label: 'Medical Shop Owner' },
  { value: 'DIAGNOSTIC_CENTER_OWNER','label': 'Diagnostic Center Owner' },
];

const schema = z.object({
  firstName:       z.string().min(2, 'First name is required'),
  lastName:        z.string().min(2, 'Last name is required'),
  username:        z.string().min(3, 'Minimum 3 characters'),
  email:           z.string().email('Valid email required'),
  phone:           z.string().min(10, 'Valid phone required'),
  role:            z.string().min(1, 'Role is required'),
  password:        z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
  preferredLanguage: z.string().default('en'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'PATIENT', preferredLanguage: 'en' },
  });

  const onSubmit = async (data) => {
    try {
      await authApi.register(data);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">MediChain</h1>
              <p className="text-primary-300/70 text-xs">Create your account</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Register</h2>
          <p className="text-slate-400 text-sm mb-8">Join the hospital management system</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              {field('firstName', 'First Name', 'text', 'John')}
              {field('lastName',  'Last Name',  'text', 'Doe')}
            </div>

            {/* Account row */}
            <div className="grid grid-cols-2 gap-4">
              {field('username', 'Username', 'text', 'john.doe')}
              {field('email',    'Email',    'email', 'john@example.com')}
            </div>

            {/* Phone & Role */}
            <div className="grid grid-cols-2 gap-4">
              {field('phone', 'Phone Number', 'tel', '+91 9876543210')}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Role <span className="text-red-400">*</span></label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  style={{ colorScheme: 'dark' }}
                >
                  {ROLES.map(r => <option key={r.value} value={r.value} className="bg-slate-800">{r.label}</option>)}
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm
                               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              {field('confirmPassword', 'Confirm Password', 'password', 'Repeat password')}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Language</label>
              <select
                {...register('preferredLanguage')}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                style={{ colorScheme: 'dark' }}
              >
                <option value="en" className="bg-slate-800">English</option>
                <option value="hi" className="bg-slate-800">हिन्दी (Hindi)</option>
                <option value="te" className="bg-slate-800">తెలుగు (Telugu)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl
                         bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600
                         text-white font-semibold text-sm shadow-glow
                         transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
