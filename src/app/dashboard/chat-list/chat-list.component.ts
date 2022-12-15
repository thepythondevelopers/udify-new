import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  @Input() vendor: any;
  @Output() openChat = new EventEmitter<string>();
  chatList: any = [];
  loading: boolean = true;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getChatList();
  }

  getChatList() {
    // chat-node/get-supplier-list
    this.api.post('chat-node/get-supplier-list', {}).subscribe(
      (data: any) => {
        this.loading = false;
        console.log('getChatList data:: ', data, this.vendor);
        this.chatList = data;
        let i = this.chatList.findIndex((x) => x._id == this.vendor._id);
        if(i>-1) {
          this.chatList[i].selected = true;
          this.showChat(this.chatList[i]);
        } else {
          this.chatList.pop(this.vendor);
        }
      },
      (err) => {
        this.loading = false;
        console.log('getChatList err:: ', err);
      }
    );
  }

  showChat(chat) {
    let ind = this.chatList.findIndex((x) => x.selected);
    if (ind > -1) {
      delete this.chatList[ind].selected;
    }
    chat.selected = true;
    this.openChat.emit(chat);
  }
}
