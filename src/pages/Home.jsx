import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import Footer from '../components/Nav/Footer';
import Loader from '../components/Nav/Loader';
import DeleteConfirmationModal from '../components/Modals/DeleteConfirmationModal ';
import logo from '../assets/images/logo.png';
import bcrypt from 'bcryptjs';

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    password: '',
    profilePic: null,
    email: '',
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(storedUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserClick = (user) => {
    const updatedUsers = users.map((u) =>
      u.name === user.name ? { ...u, isLoggedIn: true } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    navigate('/dashboard', { state: { user } });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    let profilePicBase64 = null;
    if (newUser.profilePic) {
      profilePicBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(newUser.profilePic);
      });
    }

    const hashedPassword = bcrypt.hashSync(newUser.password, 10);

    const updatedUsers = [
      ...users,
      {
        ...newUser,
        password: hashedPassword,
        profilePic: profilePicBase64,
        email: newUser.email || null,
      },
    ];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setCreatingUser(false);
    setNewUser({ name: '', password: '', profilePic: null, email: '' });
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = () => {
    const updatedUsers = users.filter((u) => u.name !== userToDelete.name);
    setUsers(updatedUsers);
    // localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setUserToDelete(null);
    localStorage.clear();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 text-white'>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
      <div className='flex-grow flex flex-col items-center justify-center px-4'>
        {users.length > 0 && !creatingUser ? (
          <>
            <img
              src={logo}
              alt='logo'
              className='w-24 h-auto max-w-full mx-auto'
            />
            <h2 className='text-4xl font-orbitron font-bold text-purplea mb-6 text-center'>
              nextGen expense tracker
            </h2>
            <p className='text-center font-orbitron text-lg text-zinc-400 mb-10'>
              Select your account to log in or add a new user
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6 mb-2'>
              {users.map((user, index) => (
                <div
                  key={index}
                  className='relative flex flex-col items-center p-6 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 group'
                >
                  {/* Trashcan Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user);
                    }}
                    className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                  >
                    <FaTrash />
                  </button>

                  {/* Profile Image or Initial */}
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className='w-32 h-32 rounded-full border-[3px]'
                      onClick={() => handleUserClick(user)}
                    />
                  ) : (
                    <div
                      className='w-32 h-32 rounded-full flex items-center justify-center border-4'
                      style={{ backgroundColor: '#674b9c' }}
                      onClick={() => handleUserClick(user)}
                    >
                      <span className='text-5xl text-white font-bold'>
                        {user.name[0].toUpperCase()}
                      </span>
                    </div>
                  )}

                  <h2 className='text-lg font-bold text-white mt-2'>
                    {user.name}
                  </h2>
                </div>
              ))}
            </div>
            <span className='mx-4 text-gray-300 font-alexandria text-4xl mb-4'>
              or
            </span>
            <button
              onClick={() => setCreatingUser(true)}
              className='px-4 py-2 font-orbitron bg-purplea text-white rounded-lg hover:bg-purpleb font-semibold'
            >
              create new account
            </button>
          </>
        ) : (
          <>
            <img
              src={logo}
              alt='logo'
              className='w-32 h-auto max-w-full mx-auto'
            />
            <h2 className='text-4xl font-orbitron font-bold text-purplea mb-6 text-center'>
              nextGen expense intelligence
            </h2>
            <p className='font-orbitron text-center text-lg text-zinc-400 mb-10'>
              A simple app to track your expenses and income effortlessly!
            </p>
            {/* Create Account Form */}
            {creatingUser ? (
              <form
                className='bg-zinc-900 p-6 rounded shadow-md w-96 border-[1px] border-purplea'
                onSubmit={handleCreateUser}
              >
                <h2 className='text-xl font-bold mb-4 font-orbitron'>
                  create your account
                </h2>
                <input
                  type='text'
                  placeholder='Name'
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className='w-full mb-3 p-2 bg-zinc-900 text-white border border-zinc-600 rounded'
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className='w-full mb-3 p-2 bg-zinc-900 text-white border border-zinc-600 rounded'
                  required
                />
                <input
                  type='email'
                  placeholder='Email (optional)'
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className='w-full mb-3 p-2 bg-zinc-900 text-white border border-zinc-600 rounded'
                />
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    setNewUser({ ...newUser, profilePic: e.target.files[0] })
                  }
                  className='w-full mb-3 p-2 bg-zinc-900 text-white border border-zinc-600 rounded'
                />
                <div className='flex gap-4'>
                  <button
                    type='submit'
                    className='w-full bg-purplea text-white p-2 rounded font-orbitron bg-gradient-to-r from-indigo-400 to-purplea hover:opacity-70 transition-all duration-300 font-semibold'
                  >
                    ceate account
                  </button>
                  <button
                    type='button'
                    className='w-full bg-gradient-to-r from-red-400 to-purplea text-white rounded hover:opacity-70 transition-all font-orbitron'
                    onClick={() => setCreatingUser(false)}
                  >
                    cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setCreatingUser(true)}
                className='px-4 py-2 font-orbitron bg-purplea text-white rounded-lg bg-gradient-to-r from-indigo-400 to-purplea hover:opacity-70 transition-all duration-300 font-semibold'
              >
                create new account
              </button>
            )}
          </>
        )}
      </div>
      <p className='text-center text-sm text-zinc-400 italic mt-4'>
        Expenzo app respects your privacy. All your data is securely stored on
        your local storage, ensuring complete control and privacy over your
        information.
      </p>
      <Footer />
    </div>
  );
};

export default Home;
