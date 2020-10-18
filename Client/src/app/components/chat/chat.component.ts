import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private myMatBottomSheetRef: MatBottomSheetRef<ChatComponent>) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this.myMatBottomSheetRef.dismiss();
    event.preventDefault();
  }

}
