export class Reviews {
    _id: string;
    UserID: string;
    ProductID: string;
    Rating: number;
    Comment: string;
    CreatedAt: Date;

    constructor(
        _id: string,
        UserID: string,
        ProductID: string,
        Rating: number,
        Comment: string,
        CreatedAt: Date
    ) {
        this._id = _id;
        this.UserID = UserID;
        this.ProductID = ProductID;
        this.Rating = Rating;
        this.Comment = Comment;
        this.CreatedAt = new Date(CreatedAt);
    }
}
