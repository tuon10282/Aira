// Core Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Add this import

// Service and model imports
import { RatingsService } from '../ratings.service';
import { Reviews } from '../classes/Review';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  // Add imports property to include CommonModule
  imports: [CommonModule]
})
export class FeedbackComponent implements OnInit {
  reviews: Reviews[] = [];
  filteredReviews: Reviews[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  selectedRating: number | null = null;

  constructor(private ratingsService: RatingsService) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  getAllReviews(): void {
    this.loading = true;
    this.ratingsService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.filteredReviews = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reviews. Please try again later.';
        this.loading = false;
        console.error('Error fetching reviews:', err);
      }
    });
  }
}