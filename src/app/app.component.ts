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

  // Token de autenticação
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDYWRhc3RybyBkZSBVc3XDoXJpbyBlIFByb2R1dG9zIiwianRpIjoiYzA0ZjUxZDQtN2Y2MS00MDdiLTlmNmEtNGU2ZTQzMjAzM2I1IiwiZXhwIjoxNzMzNjczNDc1LCJpc3MiOiJUZXN0ZS5TZWN1cmlyeS5CZWFyZXIiLCJhdWQiOiJUZXN0ZS5TZWN1cmlyeS5CZWFyZXIifQ.xYP0OI0IQgaaZ7h-Y5HkuHzzftW6ZjNHLHKZITMhrJA'; // ou `localStorage.getItem('token')` se o token estiver armazenado no localStorage
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

  // Função para deletar produto
}
