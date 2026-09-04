import React, { createContext, useContext, useState } from 'react';
import { USER_ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to Senior Officer for full overview, but easily switchable
  const [currentUser, setCurrentUser] = useState(USER_ROLES[0]);

  const switchRole = (roleId) => {
    const selected = USER_ROLES.find(r => r.id === roleId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  const isSeniorOfficer = currentUser.id === 'senior_officer' || currentUser.id === 'project_manager';
  const isDepartmentOfficer = currentUser.accessLevel === 'Department';
  const assignedDepartment = currentUser.departmentId || null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRoles: USER_ROLES,
        switchRole,
        isSeniorOfficer,
        isDepartmentOfficer,
        assignedDepartment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
