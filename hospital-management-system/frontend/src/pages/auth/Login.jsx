import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Heart, Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import { getRoleDashboard } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password:        z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuthStore();
  const navigate   = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      const { accessToken, ...user } = res.data;
      login(user, accessToken);
      toast.success(`Welcome back, ${user.fullName?.split(' ')[0] || user.username}!`);
      navigate(getRoleDashboard(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-900/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">MediChain</h1>
              <p className="text-primary-300/70 text-xs">Hospital Management Suite</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username/Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username or Email</label>
              <input
                {...register('usernameOrEmail')}
                placeholder="john.doe or john@hospital.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {errors.usernameOrEmail && <p className="text-red-400 text-xs mt-1">{errors.usernameOrEmail.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl
                         bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600
                         text-white font-semibold text-sm shadow-glow
                         transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-400 font-medium mb-2">🔑 Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <span>Admin: <span className="text-slate-300">admin / Admin@123</span></span>
            <span>Doctor: <span className="text-slate-300">doctor1 / Doc@123</span></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
