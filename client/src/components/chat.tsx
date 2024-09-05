import { createPrompt, createSteamPrompt, NewPrompt, PromptResponse } from "@/apis/prompt";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BotStatus } from "@/components/bot_status";

type Message = {
  source: 'bot' | 'user',
  content: string
}

type StreamMutationData = {
  messages: Array<Message>,
  prompt: NewPrompt
}

export default function Chat() {
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<Array<Message>>([])

  const mutation = useMutation<PromptResponse, Error, NewPrompt>({
    mutationFn: createPrompt,
    onSuccess: (data) => {
      setMessages([
        ...messages,
        { source: 'bot', content: data.content }
      ])
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
    },
  });

  const streamMutation = useMutation({
    mutationFn: async (data: StreamMutationData) => {
      const { messages, prompt } = data;
  
      const newMessages: Array<Message> = [
        ...messages,
        { source: 'bot', content: '' }
      ];
      const ml = newMessages.length;
      
      await createSteamPrompt(prompt, (chunk: string) => {

        const localMessages = newMessages;
        
        // Append the chunk to the last bot message content
        localMessages[ml - 1].content += chunk;
        
        // Update the messages state with the new chunk
        setMessages([...localMessages]);
      });
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newMessages: Array<Message> = [ ...messages, { source: 'user', content: prompt } ]
    setMessages(newMessages)

    streamMutation.mutate({ messages: newMessages, prompt: { content: prompt }});
    setPrompt('')
  };

  return (
    <div key="1" className="flex h-screen bg-white dark:bg-zinc-800">
      <section className="flex flex-col w-full">
        <header className="border-b dark:border-zinc-700 p-4">
          <BotStatus />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {
              messages.map((m, i) => {
                if (m.source === 'bot') {
                  return (
                    <div className="flex items-end gap-2 mr-20" key={i}>
                      <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
                        <p className="text-sm">{m.content}</p>
                      </div>
                    </div>
                  )
                }
                return (
                  <div className="flex items-end gap-2 justify-end ml-20" key={i}>
                    <div className="rounded-lg bg-blue-500 text-white p-2">
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </main>
        <footer className="border-t dark:border-zinc-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              className="flex-1" 
              placeholder="Type a message..." 
              value={prompt} 
              onChange={(e) => setPrompt(e.currentTarget.value)} 
              name="content"
            />
            <Button disabled={streamMutation.isPending}>
              {
                streamMutation.isPending
                ? <div className='flex space-x-1'>
                    <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-2 w-2 bg-white rounded-full animate-bounce'></div>
                  </div>
                : <>Send</>
              }
            </Button>
          </form>
        </footer>
      </section>
    </div>
  )
}
