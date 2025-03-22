import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FeedbackAPIService } from '../feedback-api.service';
import { Feedback } from '../../classes/Feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false
})
export class ContactComponent implements AfterViewInit, OnInit {
  private map!: L.Map;
  feedbacks: Feedback[] = [];
  feedback: Feedback = new Feedback();  // Khởi tạo đối tượng Feedback
  errMessage: string = '';
  successMessage: string = '';

  constructor(private _service: FeedbackAPIService) {}

  ngAfterViewInit(): void {
    console.log("contact.component.ts loaded");

    const DefaultIcon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.map = L.map('map').setView([10.762622, 106.660172], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([10.762622, 106.660172], { icon: DefaultIcon }).addTo(this.map)
      .bindPopup('Vị trí của bạn')
      .openPopup();
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  // ✅ Load danh sách feedback
  loadFeedbacks(): void {
    this._service.getFeedbacks().subscribe({
      next: (data) => { this.feedbacks = data; },
      error: (err) => { this.errMessage = err; }
    });
  }

  // ✅ Gửi feedback lên MongoDB
  onSubmit(): void {
    this._service.postFeedback(this.feedback).subscribe({
      next: (response) => {
        console.log("Feedback sent:", response);
        this.successMessage = "Feedback sent successfully!";
        this.feedback = new Feedback(); // Reset form
        this.loadFeedbacks(); // Cập nhật danh sách feedback
      },
      error: (err) => {
        console.error("Error sending feedback:", err);
        this.errMessage = "Failed to send feedback. Please try again.";
      }
    });
  }
}
