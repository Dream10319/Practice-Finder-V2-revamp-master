import axios, { AxiosHeaders } from "axios";
import { ACCESS_TOKEN } from "@/constants";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const mHeaders = AxiosHeaders.from({
        Authorization: `Bearer ${token}`,
      });

      if (mHeaders) {
        config.headers = mHeaders;
      }
    }
  } catch (error) {}

  return config;
});

API.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  async (error: any) => {
    try {
      if (error.response.status == 401) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    } catch (e) {
      console.log(error);
    }
  }
);

// Public
const contactUs = (data: any) => API.post("/api/v1/public/contact-us", data);
const validateNPI = (data: any) => API.post("/api/v1/public/validate-npi", data);
const checkEmail = (data: any) => API.post("/api/v1/public/check-email", data);

// Auth
const signIn = (data: any) => API.post("/api/v1/auth/signin", data);
const signUp = (data: any) => API.post("/api/v1/auth/signup", data);
const googleAuth = (data: any) => API.post("/api/v1/auth/google", data);
const getCurrentUser = () => API.get("/api/v1/auth/current-user");
const changePassword = (data: any) => API.post("/api/v1/auth/change-password", data);

// Practice
const getPracticeList = (data: any) => API.post("/api/v1/practice/list", data);
const getPracticeById = (id: string) => API.get(`/api/v1/practice/${id}/detail`);
const LikePractice = (id: string) => API.get(`/api/v1/practice/${id}/like`);
const getLocalAreas = (data: any) => API.post(`/api/v1/practice/local-areas`, data); 
const getStatesListingsCount = () => API.get("/api/v1/practice/states-listings-count");
const getStateListingsCount = (data: any) => API.post("/api/v1/practice/state-listings-count", data);
const getLikedListings = () => API.get("/api/v1/practice/likes");
const getLikedListingsByUserId = (id: string) => API.get(`/api/v1/practice/${id}/liked-listings`);

// User
const getUserList = () => API.get("/api/v1/user/list");
const activateUserById = (id: string) => API.get(`/api/v1/user/${id}/activate`);
const updateUserById = (id: string, data: any) => API.patch(`/api/v1/user/${id}/update`, data);

export const apis = {
  contactUs,
  validateNPI,
  checkEmail,

  signIn,
  signUp,
  googleAuth,
  getCurrentUser,
  changePassword,

  getPracticeList,
  getPracticeById,
  LikePractice,
  getLocalAreas,
  getStatesListingsCount,
  getStateListingsCount,
  getLikedListings,
  getLikedListingsByUserId,

  getUserList,
  activateUserById,
  updateUserById
};
