import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { UserTable } from '../components/UserTable';
import { UserCard } from '../components/UserCard';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSpinner';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { users, loading, deleteUser } = useUsers();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');

  // Sort State: { key: 'name' | 'age' | 'email', direction: 'asc' | 'desc' }
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Display View: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Sort Toggle
  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        if (prev.direction === 'asc') return { key: columnKey, direction: 'desc' };
        return { key: '', direction: 'asc' }; // Reset sort
      }
      return { key: columnKey, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. Search by First or Last Name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((u) => {
        const first = (u.firstName || '').toLowerCase();
        const last = (u.lastName || '').toLowerCase();
        const full = `${first} ${last}`;
        return first.includes(q) || last.includes(q) || full.includes(q);
      });
    }

    // 2. Filter by Gender
    if (selectedGender !== 'all') {
      result = result.filter(
        (u) => String(u.gender || '').toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // 3. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = '';
        let valB = '';

        if (sortConfig.key === 'name') {
          valA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
          valB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
          return sortConfig.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (sortConfig.key === 'age') {
          valA = Number(a.age) || 0;
          valB = Number(b.age) || 0;
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        if (sortConfig.key === 'email') {
          valA = (a.email || '').toLowerCase();
          valB = (b.email || '').toLowerCase();
          return sortConfig.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return 0;
      });
    }

    return result;
  }, [users, searchQuery, selectedGender, sortConfig]);

  // Pagination calculation
  const totalItems = filteredAndSortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('all');
    setSortConfig({ key: '', direction: 'asc' });
    setCurrentPage(1);
  };

  // Delete Action Handlers
  const handleDeleteConfirm = async (userId) => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      toast.success('User successfully deleted');
      setUserToDelete(null);
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick stats
  const maleCount = users.filter((u) => String(u.gender).toLowerCase() === 'male').length;
  const femaleCount = users.filter((u) => String(u.gender).toLowerCase() === 'female').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Metrics Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Directory</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{users.length}</h3>

          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Male Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{maleCount}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {users.length ? Math.round((maleCount / users.length) * 100) : 0}% of active
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
            M
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Female Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{femaleCount}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {users.length ? Math.round((femaleCount / users.length) * 100) : 0}% of active
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
            F
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md shadow-indigo-600/20 flex items-center justify-between">
          <div>

            <h3 className="text-lg font-bold mt-1">Add New User</h3>

          </div>
          <Link
            to="/create"
            className="w-11 h-11 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-all transform hover:scale-105"
            title="Create user"
          >
            <UserPlus className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Control Panel: Search, Filter, Sort, View Controls */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1 md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="user-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by first or last name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter, Sort & View Modes */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            {/* Gender Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full md:w-auto">
              <label htmlFor="gender-filter" className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Gender:
              </label>
              <select
                id="gender-filter"
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full md:w-auto">
              <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortConfig.key ? `${sortConfig.key}-${sortConfig.direction}` : ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSortConfig({ key: '', direction: 'asc' });
                  } else {
                    const [key, direction] = e.target.value.split('-');
                    setSortConfig({ key, direction });
                  }
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
              >
                <option value="">Default Order</option>
                <option value="name-asc">Name (A &rarr; Z)</option>
                <option value="name-desc">Name (Z &rarr; A)</option>
                <option value="age-asc">Age (Youngest First)</option>
                <option value="age-desc">Age (Oldest First)</option>
                <option value="email-asc">Email (A &rarr; Z)</option>
                <option value="email-desc">Email (Z &rarr; A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex self-end sm:self-auto rounded-xl border border-slate-200 p-0.5 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Grid card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(searchQuery || selectedGender !== 'all' || sortConfig.key) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span>Name: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedGender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="capitalize">Gender: {selectedGender}</span>
                <button
                  onClick={() => setSelectedGender('all')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortConfig.key && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="capitalize">
                  Sorted by {sortConfig.key} ({sortConfig.direction.toUpperCase()})
                </span>
                <button
                  onClick={() => setSortConfig({ key: '', direction: 'asc' })}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : paginatedUsers.length === 0 ? (
        <EmptyState
          title="No users match your criteria"
          description="Try modifying or clearing your search term and filters."
          onReset={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <UserTable
          users={paginatedUsers}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDeleteClick={(user) => setUserToDelete(user)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDeleteClick={(user) => setUserToDelete(user)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 sm:px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-sm text-slate-600">
          <div className="text-xs sm:text-sm text-center sm:text-left">
            Showing{' '}
            <strong className="text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </strong>{' '}
            of <strong className="text-slate-900">{totalItems}</strong> users
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(userToDelete)}
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};
