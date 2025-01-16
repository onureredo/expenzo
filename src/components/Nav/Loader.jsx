import { ProgressBar } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800'>
      <ProgressBar
        height='80'
        width='250'
        ariaLabel='progress-bar-loading'
        wrapperStyle={{}}
        wrapperClass='progress-bar-wrapper'
        borderColor='#815fc1'
        barColor='#674b9c'
      />
    </div>
  );
};

export default Loader;
