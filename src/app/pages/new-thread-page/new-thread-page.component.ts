import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-thread-page',
  templateUrl: './new-thread-page.component.html',
  styleUrls: ['./new-thread-page.component.scss']
})
export class NewThreadPageComponent implements OnInit {
  newThreadForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newThreadForm = this.fb.group({
      subject: [''],
      members: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  submitNewThreadForm(): void {
    if (this.newThreadForm.valid) {
      const subject = this.newThreadForm.get('subject')?.value;
      const members = this.newThreadForm.get('members')?.value.split(',').map((email: string) => email.trim());

      // Call the createThread() function here, passing the members array and subject.
      // After successfully creating the thread, navigate to the thread/messages page.
    }
  }
}
