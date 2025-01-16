import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default MainLayout;
