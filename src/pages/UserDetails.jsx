import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Activity,
  Globe,
  Shield,
  CreditCard,
  User,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { UserAvatar } from '../components/UserAvatar';
import toast from 'react-hot-toast';

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, deleteUser } = useUsers();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const found = await getUserById(id);
        if (isMounted) {
          if (found) {
            setUser(found);
          } else {
            setError(`User with ID #${id} could not be located.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error fetching user profile');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    return () => {
      isMounted = false;
    };
  }, [id, getUserById]);

  const handleDeleteConfirm = async (userId) => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving complete user profile..." />;
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">{error || 'This user does not exist or has been removed.'}</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User';
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  // Format address string
  const addressObj = user.address || {};
  const formattedAddress = [
    addressObj.address,
    addressObj.city,
    addressObj.state,
    addressObj.postalCode,
    addressObj.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${user.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Background ambient accent */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-bl from-indigo-100/50 via-purple-50/20 to-transparent rounded-full sm:-mr-20 sm:-mt-20 pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with fallback */}
          <UserAvatar src={user.image} name={fullName} size="xl" className="border-2 border-indigo-200/80 shadow-md" />

          {/* User Headline Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {fullName}
              </h1>
              {user.maidenName && (
                <span className="text-sm font-medium text-slate-400">
                  (née {user.maidenName})
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                ID #{user.id}
              </span>
            </div>

            <p className="text-slate-600 text-sm font-medium flex flex-wrap items-center gap-2">
              <span>{user.company?.title || user.role || 'Member'}</span>
              {user.company?.name && (
                <>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-indigo-600 font-semibold">{user.company.name}</span>
                </>
              )}
              {user.username && (
                <>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-400">@{user.username}</span>
                </>
              )}
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {user.gender && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-sky-50 text-sky-700 border border-sky-200">
                  Gender: {user.gender}
                </span>
              )}
              {user.age && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.age} Years Old
                </span>
              )}
              {user.bloodGroup && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  Blood Group: {user.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Profile Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* 1. Personal & Physical Information */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Personal &amp; Physical Metrics</h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Birth Date</dt>
              <dd className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{user.birthDate || 'Not specified'}</span>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blood Group</dt>
              <dd className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                <span>{user.bloodGroup || '—'}</span>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Height</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {user.height ? `${user.height} cm` : '—'}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {user.weight ? `${user.weight} kg` : '—'}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eye Color</dt>
              <dd className="font-semibold text-slate-800 mt-1 capitalize">
                {user.eyeColor || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hair Details</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {user.hair ? `${user.hair.color} (${user.hair.type})` : '—'}
              </dd>
            </div>
          </dl>
        </section>

        {/* 2. Contact & Network Information */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-sky-600">
            <div className="p-2 bg-sky-50 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Contact &amp; Network</h2>
          </div>

          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
              <a
                href={`mailto:${user.email}`}
                className="mt-1 inline-flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="break-all">{user.email || '—'}</span>
              </a>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
              <a
                href={`tel:${user.phone}`}
                className="mt-1 inline-flex items-center gap-2 font-medium text-slate-800 hover:text-indigo-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user.phone || '—'}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">IP Address</span>
                <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                  {user.ip || '—'}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">MAC Address</span>
                <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                  {user.macAddress || '—'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Address & Location */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-emerald-600">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Residential Address</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Street Address</span>
              <p className="font-semibold text-slate-800 mt-1">{addressObj.address || '—'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">City</span>
                <p className="font-medium text-slate-700 mt-1">{addressObj.city || '—'}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">State &amp; Postal</span>
                <p className="font-medium text-slate-700 mt-1">
                  {addressObj.state || '—'} {addressObj.postalCode ? `(${addressObj.postalCode})` : ''}
                </p>
              </div>
            </div>

            {addressObj.coordinates && (
              <div className="pt-2 text-xs text-slate-500 font-mono flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-100 rounded-md">
                  Lat: {addressObj.coordinates.lat || '—'}
                </span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">
                  Lng: {addressObj.coordinates.lng || '—'}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 4. Company & Professional Data */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-purple-600">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-base text-slate-900">Company &amp; Organization</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Company Name</span>
              <p className="font-semibold text-slate-800 mt-1 text-base">
                {user.company?.name || 'Private / Freelance'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Title / Position</span>
                <p className="font-medium text-slate-700 mt-1">{user.company?.title || user.role || '—'}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Department</span>
                <p className="font-medium text-slate-700 mt-1">{user.company?.department || '—'}</p>
              </div>
            </div>

            {user.university && (
              <div className="pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">University / Education</span>
                <p className="font-medium text-slate-700 mt-1">{user.university}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        user={user}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};
