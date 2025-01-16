const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-zinc-900 bg-opacity-90 flex items-center justify-center z-50'>
      <div className='bg-zinc-800 rounded-lg shadow-lg p-6 w-96 border-[1px] border-zinc-600'>
        <h2 className='text-lg font-bold text-white mb-4 font-orbitron border-b-[1px] py-2'>
          confirm deletion
        </h2>
        <p className='text-gray-300 mb-6 text-center'>
          Are you sure you want to delete your account{' '}
          <span className='text-purplea font-bold'>{user.name}</span>? This
          action cannot be undone.
        </p>
        <div className='flex justify-between gap-4'>
          <button
            className='px-4 py-2 w-2/4 bg-gradient-to-r from-red-400 to-purplea text-white rounded hover:opacity-70 transition-all font-orbitron'
            onClick={onConfirm}
          >
            delete
          </button>
          <button
            className='px-4 py-2 w-2/4 font-orbitron bg-purplea text-white rounded-lg bg-gradient-to-r from-indigo-400 to-purplea hover:opacity-70 transition-all duration-300 font-semibold'
            onClick={onClose}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
