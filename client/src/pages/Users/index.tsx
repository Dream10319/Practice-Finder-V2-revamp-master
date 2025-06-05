import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { apis } from "@/apis";
import Drawer from "react-modern-drawer";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import "react-modern-drawer/dist/index.css";

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
  const [users, setUsers] = React.useState([]);
  const [listings, setListings] = React.useState<Array<any>>([]);
  const [user, setUser] = React.useState<any>(null);
  const [fetchListing, setFetchListing] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const GetUserList = async () => {
    try {
      setUsers([]);
      const response: any = await apis.getUserList();
      if (response.status) {
        setUsers(response.payload.users);
      }
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
        setUsers((users: any) =>
          users.map((user: any) => {
            if (user._id === id) {
              return {
                ...user,
                activated: true,
              };
            } else {
              return user;
            }
          })
        );
      }
    } catch (err: any) {
      enqueueSnackbar({
        variant: "error",
        message: err?.response?.data?.message || "Something went wrong!!!",
      });
    }
  };

  React.useEffect(() => {
    GetUserList();
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 shadow-2xl">
      <h1 className="text-2xl font-bold">User management</h1>
      <hr className="my-2" />
      <table className="border border-[#B5B5B5] w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Activated</th>
            <th>User's listings</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>
                <div className="h-full flex items-center justify-center">
                  <div className="relative inline-block w-11 h-5">
                    <input
                      checked={user.activated}
                      onChange={() => {
                        ActivateUser(user._id);
                      }}
                      id="switch-component"
                      type="checkbox"
                      className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
                    />
                    <label
                      htmlFor="switch-component"
                      className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                    ></label>
                  </div>
                </div>
              </td>
              <td>
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
            </tr>
          ))}
        </tbody>
      </table>
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
                    <div className="text-center text-xl">
                      {" "}
                      No data available
                    </div>
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
    </div>
  );
};

export default UsersPage;
