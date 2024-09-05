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

export const createSteamPrompt = async (newPrompt: NewPrompt, onDataChunk: Function) => {
  const response = await fetch('http://localhost:5001/prompt/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPrompt),
  });

  if (!response.ok || !response.body) {
    throw new Error('Network response was not ok');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode and process each chunk of data
    const chunk = decoder.decode(value);
    
    // Send the chunk to the onDataChunk callback
    onDataChunk(chunk);
  }
};
