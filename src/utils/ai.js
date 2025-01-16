import axios from 'axios';

export const getAISuggestions = async (entries) => {
  try {
    const sanitizedEntries = entries.map((entry, idx) => ({
      type: entry.type || 'Unknown',
      amount: entry.amount || 0,
      description: entry.description || 'No description',
      date: entry.date || 'Unknown date',
      notes: entry.notes || 'No notes',
    }));

    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a financial assistant.' },
        {
          role: 'user',
          content: `Analyze these entries and give me an advice, but please keep it short: ${sanitizedEntries
            .map(
              (entry, idx) =>
                `${idx + 1}. Type: ${entry.type}, Amount: ${
                  entry.amount
                }, Description: ${entry.description}, Date: ${
                  entry.date
                }, Notes: ${entry.notes}`
            )
            .join('; ')}`,
        },
      ],
    };

    const response = await axios.post(
      import.meta.env.VITE_GPT_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          provider: 'open-ai',
          mode: 'production',
        },
      }
    );

    const aiContent = response.data?.message?.content;

    return aiContent || 'No suggestions available.';
  } catch (error) {
    console.error(
      'Error fetching AI suggestions:',
      error.response?.data || error.message
    );
    throw new Error('Failed to fetch AI suggestions.');
  }
};
