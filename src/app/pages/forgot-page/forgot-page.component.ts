import { Component } from '@angular/core';
import { ToolbarService } from '../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.component.html',
  styleUrls: ['./forgot-page.component.scss']
})
export class ForgotPageComponent {

  constructor(private toolbarService: ToolbarService) {}

  ngOnInit() {
    this.toolbarService.changeTitle('Forgot Password');
  }

}
