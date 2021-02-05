import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtbDeliveryAnalyticsHeaderComponent } from './ktb-delivery-analytics-header.component';

describe('KtbDeliveryAnalyticsHeaderComponent', () => {
  let component: KtbDeliveryAnalyticsHeaderComponent;
  let fixture: ComponentFixture<KtbDeliveryAnalyticsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtbDeliveryAnalyticsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtbDeliveryAnalyticsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
