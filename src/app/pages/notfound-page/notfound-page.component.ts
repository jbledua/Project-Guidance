import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ToolbarService } from '../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-notfound-page',
  templateUrl: './notfound-page.component.html',
  styleUrls: ['./notfound-page.component.scss']
})
export class NotfoundPageComponent implements OnInit {
  attemptedUrl: string;

  constructor(
    private location: Location, 
    private router: Router, 
    private route: ActivatedRoute,
    private toolbarService: ToolbarService) {
    // Get the URL from the ActivatedRoute snapshot
    this.attemptedUrl = this.route.snapshot.url.join('/');
  }

  ngOnInit() {
    this.toolbarService.changeTitle('Page Not Found');
  }

  // Go back to the previous page
  goBack(): void {
    this.location.back();
  }
}
