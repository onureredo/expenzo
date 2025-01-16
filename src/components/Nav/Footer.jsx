import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className='bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 text-white py-4 mt-4 border-t-[1px] border-zinc-700'>
      <div className='flex flex-col items-center space-y-4 text-center'>
        {/* Name Section */}
        <a
          href='https://onureredo.com'
          target='_blank'
          rel='noopener noreferrer'
          className='text-4xl font-barcode text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-zinc-400 to-zinc-800 mx-2 hover:underline'
        >
          onureredo
        </a>

        {/* Social Media Icons */}
        <div className='flex space-x-6'>
          <a
            href='https://github.com/onureredo'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'
            className='hover:scale-110 transform transition duration-300'
          >
            <FaGithub className='text-2xl text-zinc-400 hover:text-zinc-500' />
          </a>
          <a
            href='https://www.linkedin.com/in/onureredo'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='LinkedIn'
            className='hover:scale-110 transform transition duration-300'
          >
            <FaLinkedin className='text-2xl text-zinc-400 hover:text-blue-500' />
          </a>
          <a
            href='https://twitter.com/onureredo'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Twitter'
            className='hover:scale-110 transform transition duration-300'
          >
            <FontAwesomeIcon
              icon={faXTwitter}
              className='text-2xl text-zinc-400 hover:text-sky-500'
            />
          </a>
          <a
            href='mailto:onureredo@icloud.com'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Email'
            className='hover:scale-110 transform transition duration-300'
          >
            <FaEnvelope className='text-2xl text-zinc-400 hover:text-zinc-500' />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
