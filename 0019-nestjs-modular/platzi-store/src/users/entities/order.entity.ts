import { User } from './user.entity';
import { Product } from './../../products/entities/product.entity';

export class OrderItem {
  productId: number;
  quantity: number;
}

// export class Order {
//   id: number;
//   customer: number;
//   products: OrderItem[];
// }

export class Order {
  date: Date;
  user: User;
  products: Product[];
}
