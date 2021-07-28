import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OverlayModule} from "@angular/cdk/overlay";
import {PortalModule} from "@angular/cdk/portal";
import {TooltipComponent} from "./tooltip.component";
import {TooltipDirective} from "./tooltip.directive";

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  declarations: [TooltipComponent, TooltipDirective],
  exports: [TooltipDirective]
})
export class AppTooltipModule {
}
