// import axios from 'axios';

// const GPT_API_URL = import.meta.env.VITE_GPT_API_URL;

// export const getAdvancedAnalytics = async (entries) => {
//   try {
//     const response = await axios.post(GPT_API_URL, {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: 'You are a financial data analyst.' },
//         {
//           role: 'user',
//           content: `Analyze the following expenses: ${JSON.stringify(entries)}`,
//         },
//       ],
//     });
//     return response.data.choices[0]?.message?.content;
//   } catch (error) {
//     console.error('Error fetching advanced analytics:', error);
//     throw error;
//   }
// };
