import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import MainLayout from "@/layout/Main";
import AppLayout from "@/layout/App";

import HomePage from "@/pages/Home";
import ContactUsPage from "@/pages/ContactUs";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import HowToBuy from "@/pages/HowToBuy";
import AboutUs from "@/pages/AboutUs";
import HowMuch from "@/pages/HowMuch";
import PracticeForSalePage from "@/pages/PracticeForSale";
import StatePage from "@/pages/State";

import DashboardPage from "@/pages/Dashboard";
import UsersPage from "@/pages/Users";
import ListingsPage from "@/pages/Listings";
import ProfilePage from "@/pages/Profile";
import ListingDetailPage from "@/pages/ListingDetail";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { apis } from "@/apis";
import { SetAuthUser } from "@/store/slices/AuthSlice";

const AppRouter = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const GetCurrentUser = async () => {
    try {
      const response: any = await apis.getCurrentUser();
      if (response.status) {
        dispatch(SetAuthUser(response.payload.user));
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (token) {
      GetCurrentUser();
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <MainLayout>
              <ContactUsPage />
            </MainLayout>
          }
        />
        <Route
          path="/signin"
          element={
            <MainLayout>
              <SignInPage />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignUpPage />
            </MainLayout>
          }
        />
        <Route
          path="/how-to-buy"
          element={
            <MainLayout>
              <HowToBuy />
            </MainLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />
        <Route
          path="/how-much"
          element={
            <MainLayout>
              <HowMuch />
            </MainLayout>
          }
        />
        <Route
          path="/practices-for-sale"
          element={
            <MainLayout>
              <PracticeForSalePage />
            </MainLayout>
          }
        />
        <Route
          path="/state/:state"
          element={
            <MainLayout>
              <StatePage />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <UsersPage />
            </AppLayout>
          }
        />
        <Route
          path="/listings"
          element={
            <AppLayout>
              <ListingsPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route
          path="/listings/:id"
          element={
            <AppLayout>
              <ListingDetailPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
