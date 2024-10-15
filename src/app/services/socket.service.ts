import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { LpSocketMessage } from '../../../api/interfaces/web-socket.interface';
import { filter, retry, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private ws$ = webSocket<LpSocketMessage>(
    `/socket?token=${this.userService.token}`,
  );
  private socket$ = this.ws$.asObservable().pipe(retry({ delay: 5000 }));

  constructor(private userService: UserService) {}

  public channel(channel: LpSocketMessage['channel']) {
    return this.socket$.pipe(
      filter((message) => message.fromUserId !== this.userService.user().id),
      filter((message) => message.channel === channel),
    );
  }
}
