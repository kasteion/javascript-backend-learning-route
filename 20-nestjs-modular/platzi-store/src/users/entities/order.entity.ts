export class OrderItem {
  productId: number;
  quantity: number;
}

export class Order {
  id: number;
  customer: number;
  products: OrderItem[];
}
