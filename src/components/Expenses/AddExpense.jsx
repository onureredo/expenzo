import { useState } from 'react';
import {
  FaDollarSign,
  FaSpotify,
  FaApple,
  FaVideo,
  FaBookOpen,
} from 'react-icons/fa';
import { RiNetflixFill } from 'react-icons/ri';
import { TbBrandDisney } from 'react-icons/tb';
import { SiPrime } from 'react-icons/si';
import { FaYoutube, FaAudible } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { getAISuggestions } from '../../utils/ai';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGB from 'date-fns/locale/en-GB';
import { Discuss } from 'react-loader-spinner';
import { useExpenses } from '../../context/ExpenseProvider';

registerLocale('en-GB', enGB);

const AddExpense = () => {
  const { addEntry } = useExpenses();

  const [type, setType] = useState('Revenue');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [subscription, setSubscription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [tag, setTag] = useState('');
  const [aiSuggestions, setAISuggestions] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscriptions = [
    { name: 'Netflix', icon: <RiNetflixFill className='text-red-500' /> },
    { name: 'Spotify', icon: <FaSpotify className='text-green-500' /> },
    { name: 'Amazon Prime', icon: <SiPrime className='text-blue-500' /> },
    { name: 'YouTube Premium', icon: <FaYoutube className='text-red-600' /> },
    { name: 'Disney+', icon: <TbBrandDisney className='text-blue-500' /> },
    { name: 'Apple Music', icon: <FaApple className='text-gray-100' /> },
    { name: 'HBO Max', icon: <FaVideo className='text-purple-500' /> },
    { name: 'Audible', icon: <FaAudible className='text-orange-500' /> },
    { name: 'Other', icon: <FaBookOpen className='text-gray-500' /> },
  ];

  const tags = [
    { name: 'Shopping', color: '#F59E0B' },
    { name: 'Entertainment', color: '#8B5CF6' },
    { name: 'Food', color: '#10B981' },
    { name: 'Travel', color: '#3B82F6' },
    { name: 'Health', color: '#EF4444' },
  ];

  const handleAddEntry = async () => {
    try {
      if (!amount || isNaN(parseFloat(amount.replace(',', '.')))) {
        toast.error('Please enter a valid amount.', {
          style: {
            border: '1px solid #EF4444',
            textAlign: 'center',
            padding: '16px',
            color: '#EF4444',
            backgroundColor: '#181818',
            fontWeight: '600',
            marginTop: '9px',
          },
        });
        return;
      }

      if ((type === 'Revenue' || type === 'Expenses') && !description.trim()) {
        toast.error('Please enter a description.', {
          style: {
            border: '1px solid #EF4444',
            textAlign: 'center',
            padding: '16px',
            color: '#EF4444',
            backgroundColor: '#181818',
            fontWeight: '600',
            marginTop: '9px',
          },
        });
        return;
      }

      if (
        type === 'Subscription' &&
        (!subscription.trim() ||
          (subscription === 'Other' && !description.trim()))
      ) {
        toast.error('Please enter a subscription name.', {
          style: {
            border: '1px solid #EF4444',
            textAlign: 'center',
            padding: '16px',
            color: '#EF4444',
            backgroundColor: '#181818',
            fontWeight: '600',
            marginTop: '9px',
          },
        });
        return;
      }

      const formattedDate = format(startDate, 'dd.MM.yyyy');
      const newEntry = {
        type,
        amount: parseFloat(amount.replace(',', '.')),
        description:
          type === 'Subscription'
            ? subscription === 'Other'
              ? description.trim() || 'Other Subscription'
              : subscription
            : description.trim() || 'No Description Provided',
        date: formattedDate,
        notes,
        tag,
      };

      addEntry(newEntry);

      setAmount('');
      setDescription('');
      setSubscription('');
      setNotes('');
      setAISuggestions('');
      setTag('');

      toast.success(
        type === 'Subscription' && subscription
          ? `💸 ${amount}€ added to ${type} for the subscription of ${subscription}`
          : type === 'Revenue' && description
          ? `💸 ${amount}€ ${description} added to ${type}`
          : type === 'Expenses' && description
          ? `💸 ${amount}€ added to ${type} for ${description}`
          : `💸 ${amount}€ added to ${type}`,
        {
          style: {
            border: `1px solid ${
              type === 'Revenue'
                ? '#10B981'
                : type === 'Expenses'
                ? '#EF4444'
                : '#F59E0B'
            }`,
            textAlign: 'center',
            padding: '16px',
            color: `${
              type === 'Revenue'
                ? '#10B981'
                : type === 'Expenses'
                ? '#EF4444'
                : '#F59E0B'
            }`,
            backgroundColor: '#181818',
            fontWeight: '600',
            marginTop: '9px',
          },
          iconTheme: {
            primary:
              type === 'Revenue'
                ? '#10B981'
                : type === 'Expenses'
                ? '#EF4444'
                : '#F59E0B',
            secondary: '#F3E8FF',
          },
        }
      );

      if (useAI) {
        setLoading(true);
        try {
          const suggestions = await getAISuggestions([newEntry]);
          setAISuggestions(suggestions);
        } catch (aiError) {
          console.error('Error fetching AI suggestions:', aiError);
          toast.error('Failed to fetch AI feedback. Please try again later.', {
            style: {
              border: '1px solid #EF4444',
              textAlign: 'center',
              padding: '16px',
              color: '#EF4444',
              backgroundColor: '#181818',
              fontWeight: '600',
              marginTop: '9px',
            },
          });
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Error adding entry!', {
        style: {
          border: '1px solid #EF4444',
          textAlign: 'center',
          padding: '16px',
          color: '#EF4444',
          backgroundColor: '#181818',
          fontWeight: '600',
          marginTop: '9px',
        },
      });
      setLoading(false);
    }
  };

  return (
    <div className='p-6 border-[1px] border-purplea rounded-lg shadow-md w-full max-w-md'>
      <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 font-orbitron text-gray-200'>
        <FaDollarSign className='text-purpleb' /> add entry
      </h2>

      {/* Type Selector */}
      <div className='flex gap-4 mb-4'>
        {['Revenue', 'Expenses', 'Subscription'].map((entryType) => (
          <button
            key={entryType}
            onClick={() => setType(entryType)}
            className={`w-full py-2 px-4 rounded font-semibold ${
              type === entryType
                ? type === 'Revenue'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : type === 'Expenses'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-yellow-500 text-black hover:bg-yellow-600'
                : 'bg-zinc-100 border-[1px] border-purplea text-gray-700'
            }`}
          >
            {entryType}
          </button>
        ))}
      </div>

      {/* Input Fields */}
      {(type === 'Revenue' || type === 'Expenses') && (
        <div className='flex gap-4 mb-4'>
          <input
            type='text'
            placeholder='Enter amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
            className='w-2/5 p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
          />
          <input
            type='text'
            placeholder='Enter description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-3/5 p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
          />
        </div>
      )}

      {/* Subscription Dropdown */}
      {type === 'Subscription' && (
        <div className='mb-4'>
          <div className='relative'>
            <select
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
              className='w-full p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none appearance-none'
            >
              <option value=''>Select a subscription</option>
              {subscriptions.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-4 flex items-center pointer-events-none'>
              {subscriptions.find((sub) => sub.name === subscription)?.icon}
            </div>
          </div>
          {subscription === 'Other' && (
            <input
              type='text'
              placeholder='Enter subscription name'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full p-3 mt-4 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
            />
          )}
          <div className='flex gap-4 mt-4'>
            <input
              type='text'
              placeholder='Enter amount'
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9,]/g, ''))
              }
              className='w-1/2 p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
            />
          </div>
        </div>
      )}

      {/* Date Picker and Tag Selector */}
      <div className='flex gap-4 mb-4'>
        <DatePicker
          onChange={(date) => setStartDate(date)}
          selected={startDate}
          dateFormat='dd.MM.yyyy'
          className='w-full p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
          locale='en-GB'
        />
        {type === 'Expenses' && (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className='w-1/2 p-3 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
          >
            <option value=''>Select a tag</option>
            {tags.map((tag) => (
              <option
                key={tag.name}
                value={tag.name}
                style={{ color: tag.color }}
              >
                {tag.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Notes */}
      <textarea
        placeholder='Add notes (optional)'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className='w-full p-3 mb-4 border rounded bg-zinc-900 text-white focus:ring-2 focus:ring-purplea focus:outline-none'
        rows={3}
      ></textarea>

      {/* AI Feedback Toggle */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='relative group'>
          <div className='flex items-center'>
            <label className='text-white font-semibold mr-2'>
              Enable AI Feedback
            </label>
            <span
              className='w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs cursor-pointer group-hover:bg-purple-600'
              data-tooltip='AI will analyze your data and provide insights.'
            >
              ?
            </span>
          </div>
          <div className='absolute hidden group-hover:block bg-zinc-700 text-white text-sm rounded-lg p-2 shadow-md'>
            AI Feedback helps analyze and suggest improvements to your entries.
          </div>
        </div>

        <div
          onClick={() => setUseAI(!useAI)}
          className={`relative inline-flex items-center h-6 rounded-full w-12 cursor-pointer ${
            useAI ? 'bg-purple-600' : 'bg-gray-400'
          }`}
        >
          <span
            className={`transform transition-transform duration-200 ease-in-out ${
              useAI ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 bg-white rounded-full`}
          ></span>
        </div>
      </div>

      {/* AI Suggestions */}
      {loading ? (
        <div className='mb-4'>
          <Discuss
            visible={true}
            height='80'
            width='400'
            ariaLabel='discuss-loading'
            wrapperStyle={{}}
            wrapperClass='discuss-wrapper'
            color='#fff'
            backgroundColor='#F4442E'
          />
        </div>
      ) : (
        aiSuggestions && (
          <div className='mt-4 bg-zinc-900 text-white p-3 rounded mb-4'>
            <strong>AI Feedback:</strong> {aiSuggestions}
          </div>
        )
      )}

      {/* Submit Button */}
      <button
        onClick={handleAddEntry}
        className={`w-full py-2 px-4 rounded font-semibold ${
          type === 'Revenue'
            ? 'bg-green-500 text-white hover:bg-green-600'
            : type === 'Expenses'
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-yellow-500 text-black hover:bg-yellow-600'
        } transition-all`}
      >
        Add {type}
      </button>
    </div>
  );
};

export default AddExpense;
