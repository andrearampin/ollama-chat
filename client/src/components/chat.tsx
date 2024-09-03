import { createPrompt, NewPrompt, PromptResponse } from "@/apis/prompt";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UpdateIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BotStatus } from "@/components/bot_status";

type Message = {
  source: 'bot' | 'user',
  content: string
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrompt('')
    const formData = new FormData(event.currentTarget);
    const prompt: NewPrompt = {
      content: formData.get('content') as string,
    };
    setMessages([
      ...messages,
      { source: 'user', content: prompt.content }
    ])
    mutation.mutate(prompt);
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
                    <div className="flex items-end gap-2" key={i}>
                      <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
                        <p className="text-sm">{m.content}</p>
                      </div>
                    </div>
                  )
                }
                return (
                  <div className="flex items-end gap-2 justify-end" key={i}>
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
            {mutation.isPending && <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />}
            {!mutation.isPending && <Button>Send</Button>}
          </form>
        </footer>
      </section>
    </div>
  )
}
