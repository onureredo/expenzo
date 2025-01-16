import { createContext, useState, useContext } from 'react';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [entries, setEntries] = useState(() => {
    return JSON.parse(localStorage.getItem('entries')) || [];
  });

  const addEntry = (newEntry) => {
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  return (
    <ExpenseContext.Provider value={{ entries, addEntry }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
