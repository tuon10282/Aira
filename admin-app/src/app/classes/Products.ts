export class Product {
  constructor(
    public _id: string = "",
    public ProductName: string = "",
    public Description: string = "",
    public CategoryId: string = "", 
    public Fragrance: string = "",
    public Weight: number = 0,
    public BurningTime: number = 0,
    public Color: string = "",
    public Price: number = 0,
    public oldPrice: number = 0,
    public StockQuantity: number = 0,
    public SKU: string = "",
    public Discount: string = "",
    public Images: string[] = [],
    public Rating: number = 0,
    public ReviewCount: number = 0,
    public CreatedAt: Date = new Date(),
    public UpdatedAt: Date = new Date(),
    public Sold: number = 0
  ) {}

  // // Getter để kiểm tra tình trạng hàng
  // get availability(): string {
  //   return this.stockQuantity > 0 ? "In Stock" : "Out of Stock";
  // }
}
