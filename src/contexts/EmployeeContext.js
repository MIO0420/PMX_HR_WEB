// EmployeeContext.js
import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [jobGrade, setJobGrade] = useState('');
  const [supervisor, setSupervisor] = useState('');

  return (
    <EmployeeContext.Provider value={{ 
      companyId, 
      setCompanyId, 
      employeeId, 
      setEmployeeId,
      department,
      setDepartment,
      position,
      setPosition,
      jobGrade,
      setJobGrade,
      supervisor,
      setSupervisor
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  return useContext(EmployeeContext);
}
