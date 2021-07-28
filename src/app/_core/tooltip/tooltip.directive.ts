import {Directive, Input, TemplateRef, ElementRef, HostListener, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipComponent} from './tooltip.component';


@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  private _overlayRef: OverlayRef;
  @Input('appTooltip') template?: TemplateRef<any>;

  constructor(private _overlay: Overlay,
              private _overlayPositionBuilder: OverlayPositionBuilder,
              private _elementRef: ElementRef) {
  }

  ngOnInit() {
    if (!this.template) return;

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 5,
      }]);

    this._overlayRef = this._overlay.create({positionStrategy});
  }

  @HostListener('mouseenter')
  show() {
    //attach the component if it has not already attached to the overlay
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<TooltipComponent> = this._overlayRef.attach(new ComponentPortal(TooltipComponent));
      tooltipRef.instance.template = this.template;
    }
  }

  @HostListener('mouseleave')
  hide() {
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
  }

  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
