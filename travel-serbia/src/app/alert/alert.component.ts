import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  onClose(){
    if(this.message == "You enrolled successfully and university will be notified about your desire to go. Thank you! "){
      this.router.navigate(['/']);
    }
    this.close.emit();
  }
}
