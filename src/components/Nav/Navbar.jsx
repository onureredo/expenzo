import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = storedUsers.find((u) => u.isLoggedIn);
    setUser(loggedInUser);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = storedUsers.map((u) =>
      u.name === user.name ? { ...u, isLoggedIn: false } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    navigate('/');
  };

  const generateRandomColor = () => {
    const colors = ['#815fc1', '#674b9c', '#FF6F61', '#4CAF50', '#FF5252'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className='container mx-auto px-6 py-4 bg-zinc-900 text-white flex items-center justify-between font-orbitron'>
      {/* Welcome Message */}
      {user && (
        <div className='flex-shrink-0'>
          <h2 className='text-2xl font-bold'>
            welcome, {user.name.toLowerCase() || 'guest'}
          </h2>
        </div>
      )}

      {/* Centered Logo */}
      <div className='flex justify-center flex-grow'>
        <Link to='/'>
          <img
            src={logo}
            alt='Logo'
            className='w-16 h-auto hover:scale-110 transition-transform mr-36'
          />
        </Link>
      </div>

      {/* User Section */}
      {user && (
        <div className='relative flex-shrink-0'>
          <button
            onClick={handleProfileClick}
            className='focus:outline-none hover:scale-110 transition-transform duration-200 ease-in-out'
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt='profile'
                className='w-12 h-12 rounded-full border-2'
              />
            ) : (
              <div
                className='w-12 h-12 rounded-full flex items-center justify-center border-2'
                style={{ backgroundColor: '#674b9c' }}
              >
                <span className='text-2xl text-white font-bold'>
                  {user.name[0].toUpperCase()}
                </span>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-zinc-800 text-white rounded-lg shadow-lg z-10 divide-y divide-gray-600'>
              {/* Header */}
              <div className='px-4 py-3 text-sm text-gray-200'>
                <div>{user.name.toLowerCase()}</div>
                <div className='font-medium truncate'>
                  {user.email || 'no email'}
                </div>
              </div>

              {/* Menu Items */}
              <ul className='py-2'>
                <li>
                  <Link
                    to='/profile'
                    className='flex items-center px-4 py-2 text-gray-200 hover:bg-purplea hover:text-white'
                  >
                    <FaUser className='mr-2' /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to='/settings'
                    className='flex items-center px-4 py-2 text-gray-200 hover:bg-purplea hover:text-white'
                  >
                    <FaCog className='mr-2' /> Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className='flex items-center w-full px-4 py-2 text-left text-gray-200 hover:bg-red-500 hover:text-red-100'
                  >
                    <FaSignOutAlt className='mr-2' /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
