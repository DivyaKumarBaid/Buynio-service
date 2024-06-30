// src/gateways/simulator.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class SimulatorGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket
  ): void {
    client.join(room);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("messageToRoom")
  handleMessage(
    @MessageBody() payload: { room: string; message: string }

    // @ConnectedSocket() client: Socket
  ): void {
    this.server.to(payload.room).emit("messageToClient", payload.message);
  }

  @SubscribeMessage("elemSelectedToRoom")
  handleElemSelected(
    @MessageBody() payload: { room: string; message: string }

    // @ConnectedSocket() client: Socket
  ): void {
    this.server.to(payload.room).emit("elemSelectedToClient", payload.message);
  }

  @SubscribeMessage("updateJsonToRoom")
  handleUpdateJson(
    @MessageBody() payload: { room: string; message: any }

    // @ConnectedSocket() client: Socket
  ): void {
    this.server.to(payload.room).emit("updateJsonToClient", payload.message);
  }
}
