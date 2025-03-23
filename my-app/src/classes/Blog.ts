export class Blog {
    id: any;
    constructor(
      public _id: any = null,
      public Title: string = "",
      public Content: string = "",
      public Tags: string[] = [],
      public Images: string = "",
      public Views: number = 0,
      public Likes: number = 0,
      public Comments: Comment[] = [],
      public Status: string = "",
      public Created_at: string = "",
      public Updated_at: string = "",
      public Author: string = "",
      public Category: string = ""
    ) {}
  }
  
  export class Comment {
    constructor(
      public User_id: string = "",
      public Comment: string = "",
      public Created_at: string = ""
    ) {}
  }
