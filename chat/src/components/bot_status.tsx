import { fetchStatus } from "@/apis/bot"
import { useQuery } from "@tanstack/react-query"

export const BotStatus = () => {
  const { isFetching, isError, data } = useQuery({ queryKey: ['bot-status'], queryFn: fetchStatus })

  if (isFetching) return <span className="text-xs text-yellow-600 block font-bold">Bot unknown</span>
  if (isError) return <span className="text-xs text-red-600 block font-bold">Bot offline</span>

  if (data.ok) return <span className="text-xs text-green-600 block font-bold">Bot online</span>

  return <span className="text-xs text-red-600 block font-bold">Bot offline</span>
}