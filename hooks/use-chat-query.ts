import { useSocket } from "@/components/providers/socket-provider";
import queryString from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "chatId" | "channelId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    /*
     /api/messages?channelId={channelId}&cursor=pageParam
     */

    const url = queryString.stringifyUrl(
      {
        url: apiUrl, // /api/messages
        query: {
          cursor: pageParam, // &cursor=pageParam
          [paramKey]: paramValue, // ?channelId={channelId}
        },
      },
      { skipNull: true }
    );

    console.log(url);

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: lastPage => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isSuccess,
  };
};
