import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apis } from "@/apis";
import Drawer from "react-modern-drawer";
import { AiOutlineLoading3Quarters, AiOutlinePlus } from "react-icons/ai"; // Added AiOutlinePlus
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import "react-modern-drawer/dist/index.css";

// Define a type for your User object for better type safety
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN"; // Added role to User interface as it's part of form data and display
  activated: boolean;
  npi?: string;
  phone?: string;
  specialty?: string;
  needFinancing?: boolean;
  password?: string; // Include password as optional for formData but not for display
}

// Re-using the List component, ensure its props match 'any' or define types
const List = ({ listing }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer group"
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      <div className="flex items-center gap-5 max-[768px]:gap-5 rounded-t-xl border border-[#8F8F8F] px-3 py-1 bg-[#F5F5F5]">
        <span className="whitespace-nowrap">ID {listing.id}</span>
        <span className="font-bold">{listing.name}</span>
      </div>
      <div className="rounded-b-xl border border-[#8F8F8F] px-5 py-3 bg-white group-hover:bg-amber-200 transition-colors duration-200">
        <div>State: {listing.state}</div>
        <div>Gross Collections: {listing.annual_collections}</div>
        <div>Practice Type: {listing.type}</div>
        <div>Operatories: {listing.operatory}</div>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = React.useState<User[]>([]); // Use User[] type
  const [listings, setListings] = React.useState<Array<any>>([]);
  const [user, setUser] = React.useState<User | null>(null); // Use User | null type for currently viewed user
  const [fetchListing, setFetchListing] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false); // For user's listings drawer
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // States for Create/Edit/Delete modals
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [userToDeleteId, setUserToDeleteId] = React.useState<string | null>(null);

  // NEW: Loading states for API calls
  const [isCreating, setIsCreating] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);


  // Form states for Create/Edit User
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Only used for create, or if a change password field is added to edit
    phone: "",
    npi: "",
    specialty: "",
    needFinancing: false,
  });
  const [formErrors, setFormErrors] = React.useState<any>({});

  const GetUserList = async () => {
    try {
      setUsers([]);
      const response: any = await apis.getUserList();
      if (response.status) {
        setUsers(response.payload.users);
      }
    } catch (err) {
      console.error("Failed to fetch user list:", err);
      enqueueSnackbar({
        variant: "error",
        message: "Failed to fetch users. Please try again.",
      });
    }
  };

  const GetLikedListings = async (id: string) => {
    try {
      setListings([]);
      setFetchListing(true);
      const response: any = await apis.getLikedListingsByUserId(id);
      if (response.status) {
        setListings(response.payload.likes);
        setTotalPages(Math.ceil(response.payload.likes.length / 4));
      }
    } catch (err) {
      console.error("Failed to fetch liked listings:", err);
      enqueueSnackbar({
        variant: "error",
        message: "Failed to fetch user's liked listings.",
      });
    } finally {
      setFetchListing(false);
    }
  };

  const ActivateUser = async (id: string) => {
    try {
      const response: any = await apis.activateUserById(id);
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, activated: true } : user
          )
        );
      }
    } catch (err: any) {
      console.error("Failed to activate user:", err);
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    // Password required only for new user creation, not for edit
    if (!userToEdit && !formData.password) {
      errors.password = "Password is required";
    } else if (!userToEdit && formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Set loading state for create operation
    setIsCreating(true);
    try {
      const { firstName, lastName, email, password } = formData;
      const response: any = await apis.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        GetUserList(); // Refresh the user list
        setIsCreateModalOpen(false); // Close the modal
        setFormData({ // Reset form
            firstName: "", lastName: "", email: "", password: "",
            phone: "", npi: "", specialty: "", needFinancing: false,
        });
        setFormErrors({});
      }
    } catch (err: any) {
      console.error("Failed to create user:", err);
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Failed to create user.",
      });
    } finally {
      // Reset loading state regardless of success or failure
      setIsCreating(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: any = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
        return;
    }

    if (!userToEdit) return;

    // Set loading state for update operation
    setIsUpdating(true);
    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        npi: formData.npi,
        specialty: formData.specialty,
        needFinancing: formData.needFinancing,
      };

      const response: any = await apis.updateUserById(userToEdit._id, updatePayload);
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        GetUserList(); // Refresh the user list
        setIsEditModalOpen(false); // Close the modal
        setFormData({ // Reset form (though it will be re-populated on next edit)
            firstName: "", lastName: "", email: "", password: "",
            phone: "", npi: "", specialty: "", needFinancing: false,
        });
        setFormErrors({});
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Failed to update user.",
      });
    } finally {
      // Reset loading state regardless of success or failure
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDeleteId) return;

    // Set loading state for delete operation
    setIsDeleting(true);
    try {
      const response: any = await apis.deleteUserById(userToDeleteId);
      if (response.status) {
        enqueueSnackbar({
          variant: "success",
          message: response.message,
        });
        GetUserList(); // Refresh the user list
        setIsDeleteConfirmOpen(false); // Close confirmation
        setUserToDeleteId(null);
      }
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Failed to delete user.",
      });
    } finally {
      // Reset loading state regardless of success or failure
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    GetUserList();
  }, []);

  // Effect to populate form when userToEdit changes (for edit modal)
  React.useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        email: userToEdit.email || "",
        password: "", // Password is not pre-filled for security
        phone: userToEdit.phone || "",
        npi: userToEdit.npi || "",
        specialty: userToEdit.specialty || "",
        needFinancing: userToEdit.needFinancing || false,
      });
      setFormErrors({}); // Clear errors when opening
    } else {
        setFormData({ // Reset form when closing edit modal or initially
            firstName: "", lastName: "", email: "", password: "",
            phone: "", npi: "", specialty: "", needFinancing: false,
        });
        setFormErrors({});
    }
  }, [userToEdit]);

  // Effect to handle body scroll lock
  React.useEffect(() => {
    if (isCreateModalOpen || isEditModalOpen || isDeleteConfirmOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to ensure overflow is reset if component unmounts while modal is open
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen, isEditModalOpen, isDeleteConfirmOpen]);


  return (
    <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl">
      <h1 className="text-2xl font-bold">User management</h1>
      <hr className="my-2" />

      {/* Add New User Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <AiOutlinePlus /> Add New User
        </button>
      </div>

      <table className="border border-[#B5B5B5] w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-3 border-b border-[#B5B5B5]">No</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">Email</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">First Name</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">Last Name</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">Role</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">Activated</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">User's Listings</th>
            <th className="py-2 px-3 border-b border-[#B5B5B5]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user: User, index: number) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  {index + 1}
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  {user.email}
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  {user.firstName}
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  {user.lastName}
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  {user.role}
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  <div className="h-full flex items-center justify-center">
                    <div className="relative inline-block w-11 h-5">
                      <input
                        checked={user.activated}
                        onChange={() => {
                          ActivateUser(user._id);
                        }}
                        id={`switch-component-${user._id}`}
                        type="checkbox"
                        className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
                      />
                      <label
                        htmlFor={`switch-component-${user._id}`}
                        className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  <div className="h-full flex items-center justify-center">
                    <button
                      className="px-5 py-1 text-white bg-[#FF7575] text-sm rounded-3xl font-bold cursor-pointer hover:opacity-90"
                      onClick={() => {
                        GetLikedListings(user._id);
                        setDrawer(true);
                        setUser(user);
                      }}
                    >
                      Show Listings
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3 border-b border-[#B5B5B5]">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setUserToEdit(user);
                        setIsEditModalOpen(true);
                      }}
                      className="px-4 py-1 text-white bg-green-500 text-sm rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setUserToDeleteId(user._id);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="px-4 py-1 text-white bg-red-500 text-sm rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* User's Listings Drawer (Existing) */}
      <div>
        <Drawer
          className="fixed"
          open={drawer}
          onClose={() => setDrawer(false)}
          direction="right"
          size={400}
        >
          <div className="w-full h-[100vh] px-3 py-5">
            <h1 className="text-2xl font-extrabold">
              {user?.firstName} {user?.lastName}'s Listings
            </h1>
            <hr className="my-2" />
            <div className="px-2">
              {fetchListing ? (
                <div className="flex justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
                </div>
              ) : (
                <>
                  {listings.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {listings
                        .slice((page - 1) * 4, 4 * page)
                        .map((listing: any, index: number) => (
                          <List listing={listing} key={index} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center text-xl">No data available</div>
                  )}
                </>
              )}
              <div className="flex justify-center mt-2 items-center">
                <div className="w-[500px]">
                  <ResponsivePagination
                    current={page}
                    total={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isCreating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isCreating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isCreating} // Disable input during loading
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isCreating} // Disable input during loading
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                      setIsCreateModalOpen(false);
                      setFormData({
                          firstName: "", lastName: "", email: "", password: "",
                          phone: "", npi: "", specialty: "", needFinancing: false,
                      });
                      setFormErrors({});
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  disabled={isCreating} // Disable cancel button during loading
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  disabled={isCreating} // Disable submit button during loading
                >
                  {isCreating && <AiOutlineLoading3Quarters className="animate-spin" />}
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && userToEdit && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User: {userToEdit.email}</h2>
            <form onSubmit={handleEditUser}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">NPI</label>
                <input
                  type="text"
                  name="npi"
                  value={formData.npi}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isUpdating} // Disable input during loading
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Need Financing</label>
                <input
                  type="checkbox"
                  name="needFinancing"
                  checked={formData.needFinancing}
                  onChange={handleChange}
                  className="mt-1 ml-2"
                  disabled={isUpdating} // Disable checkbox during loading
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                      setIsEditModalOpen(false);
                      setUserToEdit(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  disabled={isUpdating} // Disable cancel button during loading
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  disabled={isUpdating} // Disable submit button during loading
                >
                  {isUpdating && <AiOutlineLoading3Quarters className="animate-spin" />}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-[0_0_10px_5px_rgba(0,0,0,0.2)] w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setUserToDeleteId(null);
                }}
                className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                disabled={isDeleting} // Disable cancel button during loading
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                disabled={isDeleting} // Disable submit button during loading
              >
                {isDeleting && <AiOutlineLoading3Quarters className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;