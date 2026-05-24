# 📊 Budget Tracker - Angular Signals Demo

**Reactividad Granular con Angular Signals**

Aplicación de demostración que implementa un tracker de presupuesto usando Angular 21.2 con el enfoque moderno de Signals. El sistema actualiza el DOM solo cuando variables específicas cambian, sin necesidad de dirty-checking.

---

## 🎯 Descripción del Sistema

### Arquitectura de Reactividad

El proyecto implementa un flujo reactivo completo basado en:

1. **Señales Primitivas (Entrada de datos)** - Variables que almacenan y notifican cambios
2. **Señales Computed (Estado Derivado)** - Valores calculados automáticamente
3. **Effects (Observadores)** - Código que se ejecuta cuando sus dependencias cambian
4. **Template (Presentación)** - Vinculación unidireccional reactiva

---

## 🏗️ Transformación del Componente TypeScript

### Señales Primitivas

```typescript
readonly budget = signal(2000);           // Presupuesto total
readonly expenses = signal<ExpenseEntry[]>([
  { amount: 120, reason: 'Gasto inicial' },
  { amount: 75, reason: 'Gasto inicial' },
]); // Array de gastos con motivo
readonly threshold = signal(80);          // Umbral de alerta (%)
readonly expenseInput = signal(0);        // Input temporal
readonly expenseReasonInput = signal(''); // Motivo temporal
```

**Comportamiento:** Estas notifican solo a sus dependientes cuando cambian, no al componente entero.

### Señales Computed (Solo Lectura)

```typescript
readonly totalSpent = computed(() =>
  this.expenses().reduce((sum, entry) => sum + entry.amount, 0)
);

readonly remaining = computed(() =>
  this.budget() - this.totalSpent()
);

readonly usagePercent = computed(() => {
  const budget = this.budget();
  if (budget <= 0) return 0;
  const percent = (this.totalSpent() / budget) * 100;
  return Math.min(100, Math.max(0, percent));
});

readonly criticalPercent = computed(() => {
  const threshold = this.threshold();
  const midpointToLimit = threshold + (100 - threshold) * 0.5;
  return Math.min(100, Math.max(0, midpointToLimit));
});

readonly alertLevel = computed(() => {
  const percent = this.usagePercent();
  const warningThreshold = this.threshold();
  const criticalThreshold = this.criticalPercent();

  if (percent >= criticalThreshold) return 'critical';
  if (percent >= warningThreshold) return 'warning';
  return 'safe';
});
```

**Propósito:** Garantizar consistencia matemática. Si `expenses` cambia, el sistema recalcula automáticamente `totalSpent`, `remaining`, `usagePercent` y `alertLevel` en cadena.

### Effect (Observador de Reactividad)

```typescript
readonly logEffect = effect(() => {
  const total = this.totalSpent();
  const level = this.alertLevel();
  console.log(`[budget-tracker] total=${total} level=${level}`);
});
```

**Evidencia:** Se ejecuta automáticamente cuando `totalSpent` o `alertLevel` cambian, imprimiendo en consola para demostrar que el sistema es reactivo sin necesidad de intervención manual.

### Manejadores de Eventos

- `onBudgetInput(event)` - Valida y actualiza presupuesto
- `onThresholdInput(event)` - Normaliza umbral entre 0-100%
- `onExpenseInput(event)` - Recibe entrada de gasto temporal
- `onExpenseReasonInput(event)` - Recibe motivo del gasto
- `addExpense()` - Agrega gasto al array y resetea input

---

## 🎨 Transformación del Template HTML

### Header (Hero Section)

Muestra el título, descripción y estado actual:

```
┌────────────────────────────────────┐
│ Tracker de Presupuesto  [SAFE 9%]  │
│ Reactividad granular...            │
└────────────────────────────────────┘
```

- Badge dinámico: 🟢 **safe** | 🟡 **warning** | 🔴 **critical**
- Porcentaje actualizado en tiempo real

### Panel Control

Inputs para manipular las señales primitivas:

- **Presupuesto total** → modifica `budget`
- **Umbral de alerta** → modifica `threshold` (0-100%)
- **Motivo del gasto** → modifica `expenseReasonInput`
- **Agregar gasto** → agrega objetos `{ amount, reason }` a `expenses` y recalcula

### Panel Métricas

Muestra valores derivados:

- **Total gastado:** suma de expenses
- **Saldo:** presupuesto - gastado (rojo si negativo)
- **Presupuesto:** valor actual
- **Barra de progreso:** ancho = porcentaje, color según alerta

### Panel Historial

Usa sintaxis moderna de Angular:

```html
@if (expenses().length === 0) {
<p>Sin gastos registrados.</p>
} @else {
<ul>
  @for (expense of expenses(); track $index) {
  <li>{{ expense.reason }} - {{ expense.amount.toFixed(2) }}</li>
  }
</ul>
}
```

---

## 🎨 Diseño y Estilos CSS

### Sistema de Colores

| Variable        | Color   | Uso             |
| --------------- | ------- | --------------- |
| `--teal-500`    | #1b8f8a | Estado seguro ✓ |
| `--amber-500`   | #ff9a2e | Advertencia ⚠️  |
| `--crimson-500` | #e24b4b | Crítico ✗       |

### Componentes Visuales

- **Hero:** Gradiente blanco, sombra suave, layout flex
- **Panels:** Grid layout, bordes redondeados, animación fade-in
- **Inputs:** Focus azul teal, transición suave
- **Botones:** Efecto hover con transform y sombra
- **Badge:** Píldora con color dinámico según alerta
- **Barra de progreso:** Transición 0.3s, color reactivo

### Responsive

- Mobile-first (mínimo 260px)
- Media query @860px: reajusta layout para móviles
- Tipografía con `clamp()` para escalabilidad

---

## 📊 Estado Inicial del Proyecto

```
Presupuesto:  $2,000.00
Gastos:       $195.00 (120 + 75)
Usado:        9.75%
Saldo:        $1,805.00
Estado:       🟢 SAFE (por debajo del 80%)
```

---

## 🔄 Flujo Reactivo en Acción

1. **Usuario ingresa presupuesto 5000** → `budget.set(5000)`
2. **Angular detecta cambio** → notifica solo a computeds dependientes
3. **Se recalculan en cascada:**
   - `remaining` → 5000 - 195 = 4805
   - `usagePercent` → (195/5000)\*100 = 3.9%
   - `criticalPercent` → punto medio entre el umbral y 100%
   - `alertLevel` → retorna `safe`, `warning` o `critical` según rango
4. **Effect se ejecuta** → logs en consola del navegador
5. **DOM se actualiza** → solo los valores afectados cambian (sin dirty-checking)

---

## 💻 Development server

To start a local development server, run:

```bash
npm start
```

or

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🏗️ Building

To build the project run:

```bash
npm run build
```

or

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🧪 Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

or

```bash
ng test
```

## 🔍 Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 🚀 Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
