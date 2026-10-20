import React from 'react';
import { Link } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { Eye, Edit3, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Mail, Building, MapPin } from 'lucide-react';

export const UserTable = ({
  users,
  sortConfig,
  onSort,
  onDeleteClick,
}) => {
  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    );
  };

  const getGenderBadge = (gender) => {
    const g = String(gender || '').toLowerCase();
    if (g === 'male') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          Male
        </span>
      );
    }
    if (g === 'female') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Female
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        {gender || 'Other'}
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider select-none">
              <th scope="col" className="py-4 px-6">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="group flex items-center gap-1.5 hover:text-indigo-600 focus:outline-none transition-colors"
                >
                  <span>User / Name</span>
                  {getSortIcon('name')}
                </button>
              </th>

              <th scope="col" className="py-4 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onSort('age')}
                  className="group inline-flex items-center gap-1.5 hover:text-indigo-600 focus:outline-none transition-colors"
                >
                  <span>Age</span>
                  {getSortIcon('age')}
                </button>
              </th>

              <th scope="col" className="py-4 px-4">
                Gender
              </th>

              <th scope="col" className="py-4 px-6">
                <button
                  type="button"
                  onClick={() => onSort('email')}
                  className="group flex items-center gap-1.5 hover:text-indigo-600 focus:outline-none transition-colors"
                >
                  <span>Email</span>
                  {getSortIcon('email')}
                </button>
              </th>

              <th scope="col" className="py-4 px-6 hidden md:table-cell">
                Company &amp; Role
              </th>

              <th scope="col" className="py-4 px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm font-normal text-slate-700">
            {users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

              return (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  {/* Avatar & Full Name */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <UserAvatar src={user.image} name={fullName} size="md" />

                      <div className="min-w-0">
                        <Link
                          to={`/user/${user.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                        >
                          <span className="truncate">{fullName}</span>
                        </Link>
                        <p className="text-xs text-slate-400 font-mono">
                          ID: #{user.id}
                          {user.username ? ` • @${user.username}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                      {user.age || '—'} yrs
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getGenderBadge(user.gender)}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <a
                      href={`mailto:${user.email}`}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                      title={user.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[220px]">{user.email}</span>
                    </a>
                  </td>

                  {/* Company & Role */}
                  <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell text-xs text-slate-500">
                    <div className="truncate max-w-[200px] font-medium text-slate-700">
                      {user.company?.name || '—'}
                    </div>
                    <div className="truncate max-w-[200px] text-slate-400">
                      {user.company?.title || user.role || 'Member'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/user/${user.id}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View user details"
                        aria-label={`View ${fullName}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/edit/${user.id}`}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit user"
                        aria-label={`Edit ${fullName}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDeleteClick(user)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete user"
                        aria-label={`Delete ${fullName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
