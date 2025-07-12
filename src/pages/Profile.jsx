import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import toast, { Toaster } from 'react-hot-toast';

const initialProfile = {
  name: '',
  nic: '',
  email: '',
  phone: '',
  address: '',
};

const Profile = () => {
  const { user, editLibrarian, getRelatedLibrarian } = useContext(AppContext);
  const [librarianData, setLibrarianData] = useState(null);
  const [form, setForm] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch librarian data on mount
  useEffect(() => {
    const fetchLibrarian = async () => {
      if (user?.email && getRelatedLibrarian) {
        const data = await getRelatedLibrarian(user.email);
        console.log('Fetched librarian data:', data);
        setLibrarianData(data);
        setForm({
          name: data?.name || '',
          nic: data?.nic || '',
          email: data?.email || '',
          phone: data?.phoneNumber || data?.phone || '',
          address: data?.address || '',
        });
      }
    };
    fetchLibrarian();
  }, [user?.email]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    if (librarianData) {
      setForm({
        name: librarianData.name || '',
        nic: librarianData.nic || '',
        email: librarianData.email || '',
        phone: librarianData.phoneNumber || librarianData.phone || '',
        address: librarianData.address || '',
      });
    } else {
      setForm(initialProfile);
    }
    setEditing(false);
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!librarianData?.librarianId) {
        toast.error('Librarian ID not found.');
        setLoading(false);
        return;
      }
      const updatedData = {
        ...librarianData,
        name: form.name,
        nic: form.nic,
        email: form.email,
        phoneNumber: form.phone,
        address: form.address,
      };
      await editLibrarian(librarianData.librarianId, updatedData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      const refreshed = await getRelatedLibrarian(user.email);
      setLibrarianData(refreshed);
      setForm({
        name: refreshed.name || '',
        nic: refreshed.nic || '',
        email: refreshed.email || '',
        phone: refreshed.phoneNumber || refreshed.phone || '',
        address: refreshed.address || '',
      });
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
                      <input
                        type="text"
                        name="nic"
                        value={form.nic}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={!editing}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    {editing ? (
                      <>
                        <button
                          type="button"
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        onClick={handleEdit}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center font-medium">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
