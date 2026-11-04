import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navbar and router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});