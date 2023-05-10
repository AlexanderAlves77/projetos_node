import { Math } from './Math';

describe('Testing the library Math', () => {
  it('should sum two numbers correctly', () => {
    const response = Math.sum(5, 10);
    expect(response).toBe(15);
  });
  
  it('should subtract two numbers correctly', () => {
    const response = Math.sub(15, 10);
    expect(response).toBe(5);
  });
  
  it('should divide two numbers correctly', () => {
    const response = Math.sum(14, 2);
    expect(response).toBe(7);
  });
  
  it('should multiply two numbers correctly', () => {
    const response = Math.mut(3, 3);
    expect(response).toBe(9);
  });
});
