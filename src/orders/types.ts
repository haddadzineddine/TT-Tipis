export enum OrderStatusValues {
  PENDING = 'pending',
  DONE = 'done',
}

export type OrderStatus =
  (typeof OrderStatusValues)[keyof typeof OrderStatusValues];
