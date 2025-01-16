import axios from 'axios';

export const setBudgetGoals = async (entries) => {
  try {
    // console.log('Entries received for budget goals:', entries);

    const sanitizedEntries = entries.map((entry) => ({
      type: entry.type || 'Unknown',
      amount: entry.amount || 0,
      description: entry.description || 'No description',
      date: entry.date || 'Unknown date',
    }));

    const totalIncome = sanitizedEntries
      .filter((entry) => entry.type === 'Revenue')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const totalOutcome = sanitizedEntries
      .filter(
        (entry) => entry.type === 'Expenses' || entry.type === 'Subscription'
      )
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const payload = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a financial advisor.' },
        {
          role: 'user',
          content: `Based on the following financial data for this month, suggest a short and concise budgeting goal: Total Income: ${totalIncome}€, Total Outcome: ${totalOutcome}€. Provide advice that focuses on improving savings or optimizing spending.`,
        },
      ],
    };

    // console.log(`Payload for AI:`, {
    //   TotalIncome: totalIncome,
    //   TotalOutcome: totalOutcome,
    // });

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

    // console.log('API response:', response.data);

    const suggestion = response.data?.message?.content;
    return suggestion || 'No budgeting suggestions available.';
  } catch (error) {
    console.error(
      'Error fetching budget goals:',
      error.response?.data || error.message
    );
    throw new Error('Failed to fetch budget goals.');
  }
};
