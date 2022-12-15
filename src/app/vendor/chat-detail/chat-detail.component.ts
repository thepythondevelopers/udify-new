import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'vendor-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css'],
})
export class ChatDetailComponent implements OnInit {
  @ViewChild('scrollMe', { static: true })
  private myScrollContainer: ElementRef;
  @Input() chat: any;
  messages: any = [];
  user: any = {};
  message: any = '';
  loading: boolean = true;
  isloaded: boolean = false;
  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes:: ', changes);
    this.messages = [];
    if (Object.keys(this.chat).length) {
      this.loading = true;
      if (this.chatSubs) {
        this.chatSubs.unsubscribe();
      }
      this.isloaded = false;
      this.getChat();
    }
  }

  getUser() {
    this.user = this.auth.getAuthUser();
    console.log('user:: ', this.user);
  }

  chatSubs: any;
  getChat() {
    this.chatSubs = this.api
      .post('chat-node/get-chat/' + this.chat._id, {})
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log('getChat data:: ', data);
          if (data.length) {
            this.messages = data;
            setTimeout(() => {
              this.scrollToBottom();
            }, 100);
            // for (let i = 0; i < data.length; i++) {
            //   // this.messages = data[i].doc;
            //   // Array.prototype.push.apply(this.messages, data[i].doc);
            // }
          } else {
            this.messages = [];
          }
          this.isloaded = true;
        },
        (err) => {
          this.loading = false;
          this.isloaded = true;
          console.log('getChat err:: ', err);
        }
      );
  }

  sendMessage() {
    if (this.message.length) {
      this.isloaded = false;
      this.api
        .post('chat-node/save-chat/', {
          send_to: this.chat._id,
          message: this.message,
        })
        .subscribe(
          (data: any) => {
            console.log('sendMessage data:: ', data);
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            this.message = '';
            this.getChat();
          },
          (err) => {
            console.log('sendMessage err:: ', err);
          }
        );
    }
  }

  reloadChat() {
    this.isloaded = false;
    this.loading = true;
    this.getChat();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    } catch (err) {}
  }
}
