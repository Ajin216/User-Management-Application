import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import toast from 'react-hot-toast';

export const CreateUser = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Additional Details Validation
    if (values.phone && values.phone.trim()) {
      const phoneDigits = values.phone.replace(/\D/g, '');
      const phoneRegex = /^[\d\s+\-().]{7,25}$/;
      if (!phoneRegex.test(values.phone.trim()) || phoneDigits.length < 7) {
        errs.phone = 'Please provide a valid phone number (at least 7 digits).';
      }
    }

    if (values.company && values.company.trim()) {
      if (values.company.trim().length < 2) {
        errs.company = 'Company name must be at least 2 characters.';
      } else if (values.company.trim().length > 50) {
        errs.company = 'Company name cannot exceed 50 characters.';
      }
    }

    if (values.title && values.title.trim()) {
      if (values.title.trim().length < 2) {
        errs.title = 'Job title must be at least 2 characters.';
      } else if (values.title.trim().length > 50) {
        errs.title = 'Job title cannot exceed 50 characters.';
      }
    }

    if (values.address && values.address.trim()) {
      if (values.address.trim().length < 3) {
        errs.address = 'Street address must be at least 3 characters.';
      } else if (values.address.trim().length > 100) {
        errs.address = 'Street address cannot exceed 100 characters.';
      }
    }

    if (values.city && values.city.trim()) {
      const cityRegex = /^[a-zA-Z\s\-'.]+$/;
      if (values.city.trim().length < 2) {
        errs.city = 'City must be at least 2 characters.';
      } else if (values.city.trim().length > 50) {
        errs.city = 'City cannot exceed 50 characters.';
      } else if (!cityRegex.test(values.city.trim())) {
        errs.city = 'City should only contain letters and spaces.';
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

    // If the field has already been touched, update error dynamically
    if (touched[name]) {
      const validationErrors = validate(nextFormData);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      age: true,
      email: true,
      phone: true,
      company: true,
      title: true,
      address: true,
      city: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please resolve the form errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addUser(formData);
      toast.success(
        `User "${created.firstName} ${created.lastName}" added successfully! (ID: #${created.id})`,
        { duration: 4000 }
      );
      navigate('/');
    } catch (err) {
      console.error('Failed to create user:', err);
      toast.error(err.message || 'Error occurred while creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New User
            </h1>

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
                <label htmlFor="firstName" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="e.g. Alexander"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.firstName && errors.firstName
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.firstName && errors.firstName)}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {touched.firstName && errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="w-full">
                <label htmlFor="lastName" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="e.g. Wright"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.lastName && errors.lastName
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.lastName && errors.lastName)}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {touched.lastName && errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="w-full">
                <label htmlFor="age" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur('age')}
                  placeholder="e.g. 28"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.age && errors.age
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.age && errors.age)}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                />
                {touched.age && errors.age && (
                  <p id="age-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label htmlFor="email" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. alex.wright@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${touched.email && errors.email
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {touched.email && errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
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
                <label htmlFor="gender" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  id="gender"
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
                <label htmlFor="phone" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+1 555-0199"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    touched.phone && errors.phone
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  aria-invalid={Boolean(touched.phone && errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {touched.phone && errors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="w-full">
                <label htmlFor="company" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={() => handleBlur('company')}
                  placeholder="e.g. Acme Tech Solutions"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    touched.company && errors.company
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  aria-invalid={Boolean(touched.company && errors.company)}
                  aria-describedby={errors.company ? 'company-error' : undefined}
                />
                {touched.company && errors.company && (
                  <p id="company-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.company}</span>
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div className="w-full">
                <label htmlFor="title" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur('title')}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    touched.title && errors.title
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  aria-invalid={Boolean(touched.title && errors.title)}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {touched.title && errors.title && (
                  <p id="title-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="w-full">
                <label htmlFor="address" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  placeholder="e.g. 742 Evergreen Terrace"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    touched.address && errors.address
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  aria-invalid={Boolean(touched.address && errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                />
                {touched.address && errors.address && (
                  <p id="address-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* City */}
              <div className="w-full">
                <label htmlFor="city" className="block w-full text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur('city')}
                  placeholder="e.g. Springfield"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    touched.city && errors.city
                      ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  aria-invalid={Boolean(touched.city && errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {touched.city && errors.city && (
                  <p id="city-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
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
              id="submit-create-user-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to DummyJSON...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
