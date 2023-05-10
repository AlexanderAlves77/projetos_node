import exp from 'constants';
import { Math } from './Math';

describe('Testing the library Math', () => {

  /* beforeEach(() => {}) */
  /* afterEach(() => {}) */
  /* beforeAll(() => {}) */
  /* afterAll(() => {}) */

  it('should sum two numbers correctly', () => {
    const response = Math.sum(5, 10);
    expect(response).toBe(15);
  });
  
  it('should subtract two numbers correctly', () => {
    const response = Math.sub(15, 10);
    expect(response).toBe(5);
  });
  
  it('should divide two numbers correctly', () => {
    const response = Math.div(14, 2);
    expect(response).toBe(7);
  });
  
  it('should multiply two numbers correctly', () => {
    const response = Math.mut(3, 3);
    expect(response).toBe(9);
  });

  it('contar quantos caracteres tem na string', () => {
    const response = 'Alexander';
    expect(response).toHaveLength(9);
  });

  it('se possui a propriedade email', () => {
    const response = { name: 'Alexander', email: 'aeca@gmail.com' };
    expect(response).toHaveProperty('email');
  });

  it('se possui certo valor maior que', () => {
    const response = 20;
    expect(response).toBeGreaterThan(15);
  });

  it('se possui certo valor maior ou igual que', () => {
    const response = 30;
    expect(response).toBeGreaterThanOrEqual(30);
  });

  it('se possui certo valor menor que', () => {
    const response = 40;
    expect(response).toBeLessThan(50);
  });

  it('se possui certo valor menor ou igual que', () => {
    const response = 99;
    expect(response).toBeLessThanOrEqual(100);
  });

  it('verificar o email se é válido', () => {
    const response = 'aeca@gmail.com';
    expect(response).toMatch(/[a-z]@[a-z].[a-z]/);
  });

  it('a lista de compras tem molho de tomate nela', () => {
    const produtos = ['fraldas', 'sacos de lixo', 'papel toalha', 
      'leite', 'molho de tomate'];
    expect(produtos).toContain('molho de tomate');
  });
});
