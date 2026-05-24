import { Component, computed, effect, signal } from '@angular/core';

type ExpenseEntry = {
  amount: number;
  reason: string;
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly budget = signal(2000);
  readonly expenses = signal<ExpenseEntry[]>([
    { amount: 120, reason: 'Gasto inicial' },
    { amount: 75, reason: 'Gasto inicial' },
  ]);
  readonly threshold = signal(80);
  readonly expenseInput = signal(0);
  readonly expenseReasonInput = signal('');

  readonly totalSpent = computed(() =>
    this.expenses().reduce((sum, entry) => sum + entry.amount, 0),
  );

  readonly remaining = computed(() => this.budget() - this.totalSpent());

  readonly usagePercent = computed(() => {
    const total = this.totalSpent();
    const budget = this.budget();

    if (budget <= 0) {
      return 0;
    }

    const percent = (total / budget) * 100;
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

    if (percent >= criticalThreshold) {
      return 'critical';
    }

    if (percent >= warningThreshold) {
      return 'warning';
    }

    return 'safe';
  });

  readonly logEffect = effect(() => {
    const total = this.totalSpent();
    const level = this.alertLevel();
    console.log(`[budget-tracker] total=${total} level=${level}`);
  });

  onBudgetInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.budget.set(Number.isFinite(value) ? value : 0);
  }

  onThresholdInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const normalized = Number.isFinite(value) ? value : 80;
    const clamped = Math.min(100, Math.max(0, normalized));
    this.threshold.set(clamped);
  }

  onExpenseInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.expenseInput.set(Number.isFinite(value) ? value : 0);
  }

  onExpenseReasonInput(event: Event): void {
    this.expenseReasonInput.set((event.target as HTMLInputElement).value);
  }

  addExpense(): void {
    const value = this.expenseInput();
    const reason = this.expenseReasonInput().trim();

    if (!Number.isFinite(value) || value <= 0 || reason.length === 0) {
      return;
    }

    this.expenses.update((items) => [...items, { amount: value, reason }]);
    this.expenseInput.set(0);
    this.expenseReasonInput.set('');
  }
}
