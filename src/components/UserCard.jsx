import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Mail, Phone, Briefcase, MapPin } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

export const UserCard = ({ user, onDeleteClick }) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  const getGenderBadge = (gender) => {
    const g = String(gender || '').toLowerCase();
    if (g === 'male') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          Male
        </span>
      );
    }
    if (g === 'female') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Female
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        {gender || 'Other'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <UserAvatar src={user.image} name={fullName} size="lg" />
            <div>
              <Link
                to={`/user/${user.id}`}
                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-base block leading-tight"
              >
                {fullName}
              </Link>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: #{user.id}</p>
            </div>
          </div>
          {getGenderBadge(user.gender)}
        </div>

        <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Age:</span>
            <span className="font-semibold text-slate-800">{user.age || '—'} yrs</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a href={`mailto:${user.email}`} className="truncate hover:text-indigo-600">
              {user.email}
            </a>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{user.phone}</span>
            </div>
          )}

          {user.company?.name && (
            <div className="flex items-center gap-2 truncate">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {user.company.title ? `${user.company.title} at ` : ''}
                {user.company.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <Link
          to={`/user/${user.id}`}
          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700 p-1"
        >
          <Eye className="w-4 h-4" />
          <span>Details</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to={`/edit/${user.id}`}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit user"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(user)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
