import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtbDeliveryAnalyticsDetailsComponent } from './ktb-delivery-analytics-details.component';

describe('KtbDeliveryAnalyticsDetailsComponent', () => {
  let component: KtbDeliveryAnalyticsDetailsComponent;
  let fixture: ComponentFixture<KtbDeliveryAnalyticsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtbDeliveryAnalyticsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtbDeliveryAnalyticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
