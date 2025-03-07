export class Product {
    constructor(
      public id: string = "",
      public name: string = "",
      public description: string = "",
      public category: string = "",
      public brand: string = "",
      public weight: string = "",
      public dimensions: { height: string; diameter: string } = { height: "", diameter: "" },
      public burn_time: string = "",
      public ingredients: string[] = [],
      public scents: string[] = [],
      public colors: string[] = [],
      public price: number = 0,
      public currency: string = "",
      public availability: string = "",
      public rating: number = 0,
      public reviews_count: number = 0,
      public package_contents: string[] = [],
      public image: string = ""
    ) {}
  }