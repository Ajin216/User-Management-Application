import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Loader2, Edit } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser } = useUsers();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    gender: 'female',
    phone: '',
    company: '',
    title: '',
    address: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      setIsLoadingUser(true);
      setLoadError(null);
      try {
        const user = await getUserById(id);
        if (isMounted) {
          if (user) {
            setFormData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              age: user.age ? String(user.age) : '',
              email: user.email || '',
              gender: user.gender || 'female',
              phone: user.phone || '',
              company: user.company?.name || '',
              title: user.company?.title || user.role || '',
              address: user.address?.address || '',
              city: user.address?.city || '',
              state: user.address?.state || '',
            });
          } else {
            setLoadError(`User with ID #${id} not found.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err.message || 'Error loading user data.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [id, getUserById]);

  // Validation function
  const validate = (values) => {
    const errs = {};

    if (!values.firstName.trim()) {
      errs.firstName = 'First Name is required.';
    } else if (values.firstName.trim().length < 2) {
      errs.firstName = 'First Name must be at least 2 characters.';
    }

    if (!values.lastName.trim()) {
      errs.lastName = 'Last Name is required.';
    } else if (values.lastName.trim().length < 2) {
      errs.lastName = 'Last Name must be at least 2 characters.';
    }

    if (!values.age) {
      errs.age = 'Age is required.';
    } else {
      const numAge = Number(values.age);
      if (isNaN(numAge) || !Number.isInteger(numAge) || numAge < 1 || numAge > 120) {
        errs.age = 'Please enter a valid age between 1 and 120.';
      }
    }

    if (!values.email.trim()) {
      errs.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email.trim())) {
        errs.email = 'Please provide a valid email format (e.g. name@example.com).';
      }
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      const validationErrors = validate(nextFormData);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      age: true,
      email: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please correct the validation errors before saving.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUser(id, formData);
      toast.success(`User updated successfully! Changes saved.`);
      navigate('/');
    } catch (err) {
      console.error('Failed to update user:', err);
      toast.error(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return <LoadingSpinner text={`Loading user #${id} details...`} />;
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs my-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Unable to Edit User</h2>
        <p className="text-sm text-slate-500 mt-2">{loadError}</p>
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

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* Main Edit Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner shrink-0">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Edit User Profile
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                ID #{id}
              </span>
            </div>

          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* Section: Core Information (Required) */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <span>Required Information</span>
              <span className="text-rose-500">*</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="w-full">
                <label htmlFor="edit-firstName" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.firstName && errors.firstName
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.firstName && errors.firstName)}
                />
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="w-full">
                <label htmlFor="edit-lastName" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.lastName && errors.lastName
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.lastName && errors.lastName)}
                />
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="w-full">
                <label htmlFor="edit-age" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="edit-age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur('age')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.age && errors.age
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.age && errors.age)}
                />
                {touched.age && errors.age && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label htmlFor="edit-email" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.email && errors.email
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Additional Profile Attributes */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Additional Details (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="w-full">
                <label htmlFor="edit-gender" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  id="edit-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other / Non-binary</option>
                </select>
              </div>

              {/* Phone */}
              <div className="w-full">
                <label htmlFor="edit-phone" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Company */}
              <div className="w-full">
                <label htmlFor="edit-company" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  id="edit-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Job Title */}
              <div className="w-full">
                <label htmlFor="edit-title" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address */}
              <div className="w-full">
                <label htmlFor="edit-address" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* City */}
              <div className="w-full">
                <label htmlFor="edit-city" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  id="edit-city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-6 border-t border-slate-100">
            <Link
              to="/"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              id="submit-edit-user-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
