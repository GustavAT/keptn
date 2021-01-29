import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtbDependencyGraphComponent } from './ktb-dependency-graph.component';

describe('KtbDependencyGraphComponent', () => {
  let component: KtbDependencyGraphComponent;
  let fixture: ComponentFixture<KtbDependencyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtbDependencyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtbDependencyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
