import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  <>
    <Navbar />
    <main className="container">
      <Outlet />
    </main>
  </>
);

export default Layout;
