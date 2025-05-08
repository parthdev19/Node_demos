import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway(1230, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'v1',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private users: string[] = [];

  handleConnection(socket: Socket) {
    console.log('socket connected', socket.id);
    this.users.push(socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('socket disconnected', socket.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoin(socket: Socket) {
    console.log('socket joined', socket.id);
    await socket.join('12345');
    socket.emit('joinRoom', 'Successfully joined room');
  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket) {
    console.log('socket connected', this.users);
    socket.emit('message', 'Hello world!');
    this.server.to('12345').emit('message', 'broadcast message');
  }
}
