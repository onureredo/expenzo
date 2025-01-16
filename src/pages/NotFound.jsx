import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Hourglass } from 'react-loader-spinner';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 text-white text-center space-y-8'>
      {/* 404 Section */}
      <h1 className='text-9xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purplea'>
        404
      </h1>

      {/* Page Not Found Message */}
      <p className='text-2xl font-orbitron text-gray-300 tracking-wider uppercase'>
        page not found
      </p>

      {/* Animated Glow Line */}
      <Hourglass
        visible={true}
        height='80'
        width='80'
        ariaLabel='hourglass-loading'
        wrapperStyle={{}}
        wrapperClass=''
        colors={['#fff', '#303030']}
      />
      {/* Under Construction Text */}
      <p className='text-lg font-orbitron text-gray-400 tracking-widest uppercase'>
        under construction
      </p>

      {/* Subtle Info Text */}
      <p className='text-sm font-orbitron text-gray-500 tracking-wide'>
        this page is currently being built. check back soon.
      </p>

      {/* Back to Home Button */}
      <Link
        to='/'
        className='flex items-center justify-center px-8 py-4 text-xl font-orbitron text-white bg-gradient-to-r from-indigo-400 to-purplea rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300 ease-in-out'
      >
        <FaArrowAltCircleLeft className='mr-3 text-2xl' />
        <span onClick={() => navigate(-1)}>back</span>
      </Link>
    </div>
  );
};

export default NotFound;
