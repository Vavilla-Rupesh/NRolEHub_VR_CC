import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, UserPlus, FileCheck } from "lucide-react";
import NavbarMenu from "./NavbarMenu";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div
              className="glass-icon-container p-2 rounded-full 
                     bg-gradient-to-br from-primary/20 to-secondary/20
                     group-hover:scale-110 transition-all duration-300"
            >
              <img src="/logo.png" alt="logo" className="w-[60px] h-[30px]" />
            </div>
            <span
              className="text-xl font-bold bg-gradient-to-r from-primary to-secondary 
                     bg-clip-text text-transparent"
            >
              NRolEHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6 w-full justify-end">
            {user ? (
              <>
                <NavbarMenu />
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/verify-certificate"
                    className="flex items-center space-x-2 text-primary bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-800"
                  >
                    <FileCheck className="h-5 w-5 text-primary dark:text-primary-dark" />
                    <span>Verify Certificate</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-primary bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                  >
                    <User className="h-5 w-5 text-primary dark:text-primary-dark" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 text-primary bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                  >
                    <UserPlus className="h-5 w-5 text-primary dark:text-primary-dark" />
                    <span>Register</span>
                  </Link>
                  {/* Theme toggle always at the end */}
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle /> {/* Always visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="glass-button ml-2 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="glass-morphism md:hidden p-4 animate-float space-y-4">
          {user ? (
            <>
              <div className="flex items-center justify-end space-x-2">
                <UserMenu />
                <span>{user.username}</span>
              </div>
              <NavbarMenu isMobile />
            </>
          ) : (
            <>
              <Link
                to="/verify-certificate"
                className="flex items-center space-x-2 text-primary bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-800"
              >
                <FileCheck className="h-5 w-5 text-primary dark:text-primary-dark" />
                <span>Verify Certificate</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 text-primary bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <User className="h-5 w-5 text-primary dark:text-primary-dark" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 text-primary bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <UserPlus className="h-5 w-5 text-primary dark:text-primary-dark" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
