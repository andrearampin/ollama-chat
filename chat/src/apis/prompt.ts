export interface NewPrompt {
  content: string;
}

export interface PromptResponse {
  content: string;
}

export const createPrompt = async (newPrompt: NewPrompt): Promise<PromptResponse> => {
  const response = await fetch('http://localhost:5001/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPrompt),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
