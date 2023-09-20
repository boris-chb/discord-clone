import { NextApiRequest } from "next";
import { Server as HttpServer } from "http";

import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: ServerIoResponse) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: HttpServer = res.socket.server as any;
    const io = new IOServer(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
