export class Blog {
    _id: string = '';
    Title: string = '';
    Content: string = '';
    Author: string = '';
    Category: string = '';
    Tags: string[] = [];
    Images: string = '';
    Status: string = 'draft';
    Views: number = 0;
    Likes: number = 0;
    Comments: any[] = [];
    CreatedAt: string = '';
    UpdatedAt: string = '';
    
    // Add this property to handle tag input
    tagsInput: string = '';
  }