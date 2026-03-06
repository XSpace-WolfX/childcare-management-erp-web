import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ccm-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
