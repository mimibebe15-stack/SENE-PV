const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const elements = new Map();
const element = selector => {
  if (!elements.has(selector)) elements.set(selector, {
    value: '', innerHTML: '', className: '', textContent: '',
    classList: { add() {}, remove() {} }, remove() {}, insertAdjacentHTML() {}
  });
  return elements.get(selector);
};
const context = vm.createContext({
  console, assert, Intl, Date, JSON, Math, String, Number, RegExp, Set,
  localStorage: { getItem: () => null, setItem() {} },
  document: { querySelector: element, body: { animate() {} } },
  navigator: { vibrate() {} }, window: {},
  setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  btoa: value => Buffer.from(value, 'utf8').toString('base64'), unescape
});

let source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
source = source.replace("import { registerPlugin } from '@capacitor/core';", 'const registerPlugin=()=>({});');
source = source.replace(/\napp\(\);\s*$/, '\n');
vm.runInContext(source, context, { filename: 'app.js' });
vm.runInContext(`
  state={vendor:{name:'Prueba'},shift:{openingCash:0,startedAt:'hoy'},products:[],sales:[],stockMoves:[],view:'stock',lastSync:Date.now(),lastSalesSync:0};
  saveStockEntry({type:'new',name:'Refresco',code:' 750 123 ',price:15,qty:4});
  assert.strictEqual(state.products.length,1,'El producto nuevo debe guardarse');
  assert.strictEqual(state.products[0].code,'750123','El código debe normalizarse');
  assert.strictEqual(findProduct('750123').name,'Refresco','El producto debe encontrarse por código');
  cart=[]; addToCart('750 123'); assert.strictEqual(cart.length,1,'El producto debe agregarse a Ventas');
  document.querySelector('#received').value='20'; confirmSale(15);
  assert.strictEqual(state.sales.length,1,'La venta debe persistirse');
  assert.strictEqual(state.products[0].stock,3,'La venta debe descontar el stock');
  assert.strictEqual(salesTotal(),15,'Ventas de hoy debe incluir la venta');
  saveStockEntry({type:'existing',code:'750123',qty:2});
  assert.strictEqual(state.products[0].stock,5,'El ingreso posterior debe actualizar el stock');
  const inventory=inventoryPayload();
  assert.strictEqual(inventory.products[0].code,'750123','El inventario debe conservar el código normalizado');
  assert.ok(updateRecord().name.endsWith('.txt'),'La actualización de ventas debe ser TXT');
  assert.ok(updateText().includes('Ventas del día'),'El reporte debe incluir el total diario');
`, context, { filename: 'smoke-flow.js' });

console.log('Flujo validado: stock nuevo, búsqueda/venta, ventas de hoy e ingreso adicional.');
