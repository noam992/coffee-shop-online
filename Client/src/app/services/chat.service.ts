import { Injectable } from '@angular/core';
import { ChatModel } from './../models/chat-model';
import { MessageModel } from './../models/message-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  // Get chat for specific user
  public getChatPerUser(userId: string): Promise<ChatModel[]>{
    return this.http.get<ChatModel[]>("./api/chat/" + userId).toPromise();
  }

  // Add new chat
  public addChat(chatDetails: ChatModel): Promise<ChatModel[]>{
    return this.http.post<ChatModel[]>("./api/chat/", chatDetails).toPromise();
  }

  // Get all messages ,which related to chat id
  public getAllMessagesOfChatId(chatId: string): Promise<MessageModel[]>{
    return this.http.get<MessageModel[]>("./api/chat/message/" + chatId).toPromise();
  }

  // Add new message
  public addMessage(messageDetails: MessageModel): Promise<MessageModel[]>{
    return this.http.post<MessageModel[]>("./api/chat/add-message", messageDetails).toPromise();
  }

  // Delete message
  public deleteMessage(messageId: string): Promise<MessageModel[]>{
    return this.http.delete<MessageModel[]>("./api/chat/delete-message/" + messageId).toPromise();
  }

}
