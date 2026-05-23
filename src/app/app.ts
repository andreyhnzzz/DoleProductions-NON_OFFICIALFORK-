import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly budget = signal(2000);
  readonly expenses = signal<number[]>([120, 75]);
  readonly threshold = signal(80);
  readonly expenseInput = signal(0);

  readonly totalSpent = computed(() => this.expenses().reduce((sum, value) => sum + value, 0));

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

  readonly alertLevel = computed(() => {
    const percent = this.usagePercent();
    const threshold = this.threshold();

    if (percent >= 100) {
      return 'critical';
    }

    if (percent >= threshold) {
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

  addExpense(): void {
    const value = this.expenseInput();

    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.expenses.update((items) => [...items, value]);
    this.expenseInput.set(0);
  }
}
