import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { StocksModule } from './stocks/stocks.module';
import { DATA_BASE_CONFIG } from './config/configuration';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    StocksModule,
    TypeOrmModule.forRoot(DATA_BASE_CONFIG),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
