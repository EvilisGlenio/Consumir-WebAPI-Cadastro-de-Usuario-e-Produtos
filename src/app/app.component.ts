import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Consumir-WebAPI-Cadastro-de-Usuario-e-Produtos';
  http = inject(HttpClient);
  url = 'http://localhost:5284';
  // Listar produtos
  products$?: Observable<Product[]>;

  // Buscar produto por ID
  getProducts$?: Observable<Product>;
  searchProductId = '';

  // Cadastrar produto
  newProductName = '';

  // Editar produto
  editProductId = '';
  editProductName = '';

  // Deletar produto
  removeProductId = '';

  // Token de autenticação
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDYWRhc3RybyBkZSBVc3XDoXJpbyBlIFByb2R1dG9zIiwianRpIjoiOWI1NGQ4NzgtNjBkNS00MmJlLWFlMTQtYmJmN2Q5YmRjMmJhIiwiZXhwIjoxNzMzNzU0NDU2LCJpc3MiOiJUZXN0ZS5TZWN1cmlyeS5CZWFyZXIiLCJhdWQiOiJUZXN0ZS5TZWN1cmlyeS5CZWFyZXIifQ.lcVmmEovw7rN9DftrjeY9yA-W9Vu9W_Ih52KNHVbHpM'; // ou `localStorage.getItem('token')` se o token estiver armazenado no localStorage
  headers = {
    Authorization: `Bearer ${this.token}`,
  };

  ngOnInit(): void {
    this.getProducts();
  }

  // Função para listar produtos
  getProducts() {
    this.products$ = this.http.get<Product[]>(`${this.url}/api/List`, {
      headers: this.headers,
    });
  }

  // Função para buscar produto por ID
  getProductById() {
    if (!this.searchProductId) {
      alert('Por favor, insira um ID válido.');
      return;
    }

    this.getProducts$ = this.http.get<Product>(
      `${this.url}/api/GetEntityById`,
      {
        headers: this.headers,
        params: {
          id: this.searchProductId,
        },
      }
    );
  }

  // Função cadastrar produto
  async addProduct() {
    if (!this.newProductName) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const newProduct: Product = {
      name: this.newProductName,
    };

    await this.http
      .post<Product>(`${this.url}/api/Add`, newProduct, {
        headers: this.headers,
      })
      .subscribe((response) => {
        console.log('Produto adicionado com sucesso:', response);
        this.newProductName = '';
        this.getProducts();
      });
  }

  // Função para atualizar produto
  updateProduct() {
    if (!this.editProductId || !this.editProductName) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const updatedProduct: Product = {
      id: this.editProductId,
      name: this.editProductName,
    };

    this.http
      .put<Product>(`${this.url}/api/Update`, updatedProduct, {
        headers: this.headers,
      })
      .subscribe((response) => {
        console.log('Produto atualizado com sucesso:', response);
        this.editProductId = '';
        this.editProductName = '';
        this.getProducts();
      });
  }

  // Função para deletar produto
  removeProduct() {
    if (!this.removeProductId) {
      alert('Por favor, insira um ID válido.');
      return;
    }
    this.http
      .delete<Product>(`${this.url}/api/Delete`, {
        headers: this.headers,
        params: {
          id: this.removeProductId,
        },
      })
      .subscribe((response) => {
        console.log('Produto removido com sucesso:', response);
        this.removeProductId = '';
        this.getProducts();
      });
  }
}
