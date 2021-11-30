test('Validar as principais operações do JEST', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Validar operações com objetos', () => {
  const obj = { name: 'Marco & Miguel', mail: 'marcomiguel@ipca.pt' };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Marco & Miguel');
  expect(obj.name).toBe('Marco & Miguel');

  const obj2 = { name: 'Marco & Miguel', mail: 'marcomiguel@ipca.pt' };
  expect(obj).toEqual(obj2);
});
