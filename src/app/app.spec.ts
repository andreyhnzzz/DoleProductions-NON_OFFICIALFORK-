import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the tracker title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Tracker de Presupuesto');
  });

  it('should block adding expense without reason', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.expenseInput.set(90);
    app.expenseReasonInput.set('   ');
    app.addExpense();

    expect(app.expenses().length).toBe(2);
  });

  it('should add an expense with reason', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.expenseInput.set(90);
    app.expenseReasonInput.set('Comida');
    app.addExpense();

    expect(app.expenses().length).toBe(3);
    expect(app.expenses()[2]).toEqual({ amount: 90, reason: 'Comida' });
  });

  it('should switch to critical before reaching 100 percent usage', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.threshold.set(80);
    app.budget.set(1000);
    app.expenses.set([{ amount: 900, reason: 'Renta' }]);

    expect(app.usagePercent()).toBe(90);
    expect(app.alertLevel()).toBe('critical');
  });

  it('should stay warning between threshold and critical threshold', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.threshold.set(80);
    app.budget.set(1000);
    app.expenses.set([{ amount: 850, reason: 'Servicios' }]);

    expect(app.usagePercent()).toBe(85);
    expect(app.alertLevel()).toBe('warning');
  });
});
