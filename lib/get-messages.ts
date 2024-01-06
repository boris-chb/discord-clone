import queryString from "query-string";
import axios from "axios";

export const getMessages = async (channelId: string, cursor?: string) => {
  const url = queryString.stringifyUrl(
    {
      url: "/api/messages",
      query: {
        channelId,
        cursor, // this will be undefined if not provided, and queryString will omit it
      },
    },
    { skipNull: true, skipEmptyString: true },
  );

  const { data } = await axios.get(url);
  return data;
};
