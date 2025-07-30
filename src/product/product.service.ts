import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './domain/repositories/product.repository';
import { Product } from './domain/entities/product.entity';
import { InterestRate } from './domain/value-objects/interest-rate.value-object';
import { Term } from './domain/value-objects/term.value-object';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product(
      uuidv4(),
      createProductDto.name,
      createProductDto.code,
      Term.fromMonths(createProductDto.termMonths),
      new InterestRate(createProductDto.interestRate),
      createProductDto.sum,
    );

    await this.productRepository.save(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(id);
    
    const updatedProduct = new Product(
      existingProduct.id,
      updateProductDto.name ?? existingProduct.name,
      updateProductDto.code ?? existingProduct.code,
      updateProductDto.termMonths ? Term.fromMonths(updateProductDto.termMonths) : existingProduct.term,
      updateProductDto.interestRate ? new InterestRate(updateProductDto.interestRate) : existingProduct.interestRate,
      updateProductDto.sum ?? existingProduct.sum,
    );

    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.delete(product.id);
  }
}
