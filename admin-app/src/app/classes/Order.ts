export class Order {
    _id: string;
    userId: string;
    checkoutId: string;
    shippingInfo: Record<string, any>;  // Assuming shippingInfo is an object with dynamic keys
    paymentMethod: string;
    orderSummary: Record<string, any>;  // Assuming orderSummary is an object with dynamic keys
    orderDate: string;
    status: string;

    constructor(
        _id: string,
        userId: string,
        checkoutId: string,
        shippingInfo: Record<string, any>,
        paymentMethod: string,
        orderSummary: Record<string, any>,
        orderDate: string,
        status: string
    ) {
        this._id = _id;
        this.userId = userId;
        this.checkoutId = checkoutId;
        this.shippingInfo = shippingInfo;
        this.paymentMethod = paymentMethod;
        this.orderSummary = orderSummary;
        this.orderDate = orderDate;
        this.status = status;
    }
}
