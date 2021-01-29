import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtbReleaseOrderComponent } from './ktb-release-order.component';

describe('KtbReleaseOrderComponent', () => {
  let component: KtbReleaseOrderComponent;
  let fixture: ComponentFixture<KtbReleaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtbReleaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtbReleaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
