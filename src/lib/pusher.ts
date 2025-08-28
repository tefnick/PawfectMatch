import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Ensure that Pusher instances are only created once in a global context
// This prevents issues with hot reloading in development environments
// and allows for consistent usage across the application.
declare global {
  var pusherServerInstance: PusherServer | undefined;
  var PusherClientInstance: PusherClient | undefined;
}

// configure Pusher server instance
if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: 'mt1',
    useTLS: true,
  })
}

//configure Pusher client instance
if (!global.PusherClientInstance) {
  global.PusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    channelAuthorization: {
      endpoint: '/api/pusher-auth',
      transport: 'ajax',
    },
    cluster: 'mt1',
  })
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.PusherClientInstance;
