const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "ApiMobile Backend API",
    version: "1.0.0",
    description: "Documentacao das rotas de autenticacao, usuarios, pets e servicos."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ],
  tags: [
    { name: "Health", description: "Status da API" },
    { name: "Auth", description: "Cadastro e login" },
    { name: "Users", description: "Perfil do usuario autenticado" },
    { name: "Pets", description: "Pets do usuario autenticado" },
    { name: "Services", description: "Catalogo de servicos" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensagem de erro" }
        }
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["\"email\" must be a valid email"]
          }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "67f0f94551987947a2484fc0" },
          nome: { type: "string", example: "Analice Piccoli" },
          cpf: { type: "string", example: "12345678901" },
          email: { type: "string", format: "email", example: "analice@email.com" },
          telefone: { type: "string", example: "11999999999" },
          endereco: { type: "string", example: "Rua A, 123" },
          role: { type: "string", enum: ["user", "admin"], example: "user" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["cpf", "email", "password", "telefone"],
        properties: {
          nome: { type: "string", example: "Analice Piccoli" },
          name: { type: "string", example: "Analice Piccoli" },
          cpf: { type: "string", example: "12345678901" },
          email: { type: "string", format: "email", example: "analice@email.com" },
          password: { type: "string", example: "123456" },
          telefone: { type: "string", example: "11999999999" },
          endereco: { type: "string", example: "Rua A, 123" },
          role: { type: "string", enum: ["user", "admin"], example: "user" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "analice@email.com" },
          password: { type: "string", example: "123456" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      UserUpdateRequest: {
        type: "object",
        properties: {
          nome: { type: "string", example: "Analice P." },
          cpf: { type: "string", example: "12345678901" },
          email: { type: "string", format: "email", example: "novo@email.com" },
          telefone: { type: "string", example: "11988888888" },
          endereco: { type: "string", example: "Rua B, 456" }
        }
      },
      Pet: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f0faa351987947a2484fd4" },
          nome: { type: "string", example: "Mima" },
          idade: { type: "number", example: 5 },
          raca: { type: "string", example: "Maine Coon" },
          peso: { type: "number", example: 4.2 },
          porte: { type: "string", example: "medio" },
          alergias: { type: "string", example: "Nenhuma" },
          fotoUrl: { type: "string", example: "https://site.com/mima.jpg" },
          owner: { type: "string", example: "67f0f94551987947a2484fc0" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      PetInput: {
        type: "object",
        properties: {
          nome: { type: "string", example: "Mima" },
          name: { type: "string", example: "Mima" },
          idade: { type: "number", example: 5 },
          age: { type: "number", example: 5 },
          raca: { type: "string", example: "Maine Coon" },
          breed: { type: "string", example: "Maine Coon" },
          peso: { type: "number", example: 4.2 },
          porte: { type: "string", example: "medio" },
          alergias: { type: "string", example: "Nenhuma" },
          fotoUrl: { type: "string", example: "https://site.com/mima.jpg" }
        }
      },
      Service: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f0fb5f51987947a2484fe1" },
          nome: { type: "string", example: "Banho" },
          descricao: { type: "string", example: "Deixe seu pet cheiroso" },
          tempoEstimadoMin: { type: "number", example: 60 },
          preco: { type: "number", example: 60 },
          ativo: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      ServiceInput: {
        type: "object",
        required: ["nome", "preco"],
        properties: {
          nome: { type: "string", example: "Banho e tosa" },
          descricao: { type: "string", example: "Banho completo com tosa" },
          tempoEstimadoMin: { type: "number", example: 90 },
          preco: { type: "number", example: 95 },
          ativo: { type: "boolean", example: true }
        }
      },
      UploadPhotoResponse: {
        type: "object",
        properties: {
          fotoUrl: { type: "string", example: "http://localhost:3000/uploads/pets/171234567-123.jpg" },
          arquivo: { type: "string", example: "171234567-123.jpg" }
        }
      }
    }
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check da API",
        responses: {
          200: {
            description: "API ativa",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cadastrar usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "Usuario criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          400: {
            description: "Erro de validacao",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorResponse" }
              }
            }
          },
          409: {
            description: "Email ou CPF ja cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login do usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Login realizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          401: {
            description: "Credenciais invalidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Obter dados do usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dados do usuario",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          401: {
            description: "Sem token ou token invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          404: {
            description: "Usuario nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Atualizar dados do usuario autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserUpdateRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Usuario atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          400: {
            description: "Erro de validacao",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorResponse" }
              }
            }
          },
          409: {
            description: "Email ou CPF ja em uso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/users/pets": {
      get: {
        tags: ["Pets"],
        summary: "Listar pets do usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de pets",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Pet" }
                }
              }
            }
          },
          401: {
            description: "Sem token ou token invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      post: {
        tags: ["Pets"],
        summary: "Criar pet para o usuario autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PetInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Pet criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" }
              }
            }
          },
          401: {
            description: "Sem token ou token invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/users/pets/upload": {
      post: {
        tags: ["Pets"],
        summary: "Upload da foto do pet",
        description: "Recebe imagem em multipart/form-data no campo `foto` e devolve URL publica.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["foto"],
                properties: {
                  foto: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Upload concluido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UploadPhotoResponse" }
              }
            }
          },
          400: {
            description: "Arquivo invalido ou ausente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/users/pets/{id}": {
      get: {
        tags: ["Pets"],
        summary: "Buscar pet por ID do usuario autenticado",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Pet encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" }
              }
            }
          },
          404: {
            description: "Pet nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Pets"],
        summary: "Atualizar pet por ID do usuario autenticado",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PetInput" }
            }
          }
        },
        responses: {
          200: {
            description: "Pet atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" }
              }
            }
          },
          404: {
            description: "Pet nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Pets"],
        summary: "Remover pet por ID do usuario autenticado",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Pet removido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Pet deletado" }
                  }
                }
              }
            }
          },
          404: {
            description: "Pet nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "Listar servicos ativos",
        parameters: [
          {
            name: "q",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Busca por nome ou descricao"
          }
        ],
        responses: {
          200: {
            description: "Lista de servicos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Service" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Services"],
        summary: "Criar servico (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServiceInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Servico criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Service" }
              }
            }
          },
          403: {
            description: "Apenas admin",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/services/{id}": {
      put: {
        tags: ["Services"],
        summary: "Atualizar servico (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServiceInput" }
            }
          }
        },
        responses: {
          200: {
            description: "Servico atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Service" }
              }
            }
          },
          404: {
            description: "Servico nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Services"],
        summary: "Remover servico (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Servico removido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Servico removido" }
                  }
                }
              }
            }
          },
          404: {
            description: "Servico nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerSpec;
