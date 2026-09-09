import React, { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  User,
  Shield,
  Users,
  Calendar,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Building,
  Globe,
  Award,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function Settings({ currentUser, staffUsers, eventSettings }) {
  const { props } = usePage();
  const adminUrls = props?.adminUrls || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // 1. Profile Form
  const profileForm = useForm({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileForm.put(adminUrls.settingsProfile || '/cms/settings/profile', { preserveScroll: true });
  };

  // 2. Password Form
  const passwordForm = useForm({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.put(adminUrls.settingsPassword || '/cms/settings/password', {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  };

  // 3. New Staff User Form
  const staffForm = useForm({
    name: '',
    email: '',
    role: 'EDITOR',
    password: '',
    phone: '',
  });

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    staffForm.post(adminUrls.settingsUsersStore || '/cms/settings/users', {
      preserveScroll: true,
      onSuccess: () => {
        staffForm.reset();
        setIsAddStaffOpen(false);
      },
    });
  };

  const handleDeleteStaff = (user) => {
    if (confirm(`Are you sure you want to remove staff user ${user.name} (${user.email})?`)) {
      router.delete(`${adminUrls.settingsUsersStore || '/cms/settings/users'}/${user.id}`, { preserveScroll: true });
    }
  };

  // 4. Event Settings Form
  const eventForm = useForm({
    event_name: eventSettings?.event_name || 'MARPORTS GLOBAL 2027',
    event_edition: eventSettings?.event_edition || 'Conference & Excellence Awards',
    event_date: eventSettings?.event_date || '2027-02-05',
    event_date_display: eventSettings?.event_date_display || '5th February 2027',
    event_venue: eventSettings?.event_venue || 'Taj Coromandel',
    event_city: eventSettings?.event_city || 'Chennai',
    event_state: eventSettings?.event_state || 'Tamil Nadu',
    event_country: eventSettings?.event_country || 'India',
    organizer_name: eventSettings?.organizer_name || 'E HUB EVENTS PRIVATE LIMITED',
    organizer_url: eventSettings?.organizer_url || 'https://www.ehub.events',
    contact_email: eventSettings?.contact_email || 'jayadev@marportsglobal.com',
    awards_email: eventSettings?.awards_email || 'awards@marportsglobal.com',
    contact_phone: eventSettings?.contact_phone || '+91 9633958465',
    registration_url: eventSettings?.registration_url || 'https://ehub.events/events?register=marports',
  });

  const handleEventSubmit = (e) => {
    e.preventDefault();
    eventForm.put(adminUrls.settingsEvent || '/cms/settings/event', { preserveScroll: true });
  };

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'event', label: 'Event Configuration', icon: Calendar },
  ];

  return (
    <AdminLayout
      title="System Settings"
      subtitle="Configure administrative privileges, account credentials, staff users, and summit data"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#152747] pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#22C55E] text-[#0A1E3F]'
                    : 'bg-[#0A1529] text-slate-300 hover:bg-[#112344] hover:text-white border border-[#152747]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0A1E3F]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-6 max-w-2xl">
            <div className="flex items-center justify-between pb-5 border-b border-[#152747] mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Administrative Profile
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your contact info and personal credentials
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {currentUser?.role || 'SYSTEM ADMIN'}
              </span>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileForm.data.first_name}
                    onChange={(e) => profileForm.setData('first_name', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.data.last_name}
                    onChange={(e) => profileForm.setData('last_name', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={profileForm.data.email}
                    onChange={(e) => profileForm.setData('email', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                {profileForm.errors.email && (
                  <p className="text-rose-400 text-[11px] mt-1">{profileForm.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profileForm.data.phone}
                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={profileForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileForm.processing ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Security */}
        {activeTab === 'security' && (
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-6 max-w-2xl">
            <div className="pb-5 border-b border-[#152747] mb-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Password & Authentication
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensure your administrator account uses a strong, secure passphrase
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Current Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordForm.data.current_password}
                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                {passwordForm.errors.current_password && (
                  <p className="text-rose-400 text-[11px] mt-1">{passwordForm.errors.current_password}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.data.new_password}
                    onChange={(e) => passwordForm.setData('new_password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                  {passwordForm.errors.new_password && (
                    <p className="text-rose-400 text-[11px] mt-1">{passwordForm.errors.new_password}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.data.new_password_confirmation}
                    onChange={(e) => passwordForm.setData('new_password_confirmation', e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={passwordForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{passwordForm.processing ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Staff Users */}
        {activeTab === 'staff' && (
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#152747] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#081120]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Staff Members & Administrators
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Users with authorized access to the Marports Global CMS dashboard
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#152747] bg-[#070E1B] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-5">Staff Member</th>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-5">Role</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#152747]/60">
                  {staffUsers?.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0E1E38] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-white">{user.name}</div>
                        {user.phone && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{user.phone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300 font-mono text-[11px] select-all">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            user.role === 'SYSTEM ADMIN'
                              ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25'
                              : 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {user.id !== currentUser?.id ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(user)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Remove staff member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Current user</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Event Configuration */}
        {activeTab === 'event' && (
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-6">
            <div className="pb-5 border-b border-[#152747] mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Summit & Event Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update official summit metadata saved directly to MySQL database
                </p>
              </div>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_name}
                    onChange={(e) => eventForm.setData('event_name', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Event Edition</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_edition}
                    onChange={(e) => eventForm.setData('event_edition', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Event Date (ISO Format: YYYY-MM-DD for Countdown)
                  </label>
                  <input
                    type="date"
                    required
                    value={eventForm.data.event_date}
                    onChange={(e) => eventForm.setData('event_date', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Display Date Text</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_date_display}
                    onChange={(e) => eventForm.setData('event_date_display', e.target.value)}
                    placeholder="e.g. 5th February 2027"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Venue Hotel</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_venue}
                    onChange={(e) => eventForm.setData('event_venue', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_city}
                    onChange={(e) => eventForm.setData('event_city', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.event_country}
                    onChange={(e) => eventForm.setData('event_country', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">General Inquiries Email</label>
                  <input
                    type="email"
                    required
                    value={eventForm.data.contact_email}
                    onChange={(e) => eventForm.setData('contact_email', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Awards Inquiries Email</label>
                  <input
                    type="email"
                    required
                    value={eventForm.data.awards_email}
                    onChange={(e) => eventForm.setData('awards_email', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.contact_phone}
                    onChange={(e) => eventForm.setData('contact_phone', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Online Registration URL</label>
                  <input
                    type="text"
                    required
                    value={eventForm.data.registration_url}
                    onChange={(e) => eventForm.setData('registration_url', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={eventForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{eventForm.processing ? 'Saving...' : 'Save Summit Configuration'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modal: Add Staff User */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#152747] flex items-center justify-between bg-[#081120]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Create New Staff Account
              </h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffForm.data.name}
                  onChange={(e) => staffForm.setData('name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={staffForm.data.email}
                  onChange={(e) => staffForm.setData('email', e.target.value)}
                  placeholder="staff@marportsglobal.com"
                  className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                />
                {staffForm.errors.email && (
                  <p className="text-rose-400 text-[11px] mt-1">{staffForm.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Role *</label>
                  <select
                    value={staffForm.data.role}
                    onChange={(e) => staffForm.setData('role', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="EDITOR">EDITOR</option>
                    <option value="SYSTEM ADMIN">SYSTEM ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={staffForm.data.phone}
                    onChange={(e) => staffForm.setData('phone', e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={staffForm.data.password}
                  onChange={(e) => staffForm.setData('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                />
                {staffForm.errors.password && (
                  <p className="text-rose-400 text-[11px] mt-1">{staffForm.errors.password}</p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#112344] text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffForm.processing}
                  className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold disabled:opacity-50"
                >
                  {staffForm.processing ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
