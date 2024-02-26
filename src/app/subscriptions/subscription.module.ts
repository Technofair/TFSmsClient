import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberManagementRoutingModule } from './subscription-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from "primeng/tabview";
import { AddSubscriberComponent } from './add-subscriber/add-subscriber.component';
import { SubscriberListComponent } from './add-subscriber/subscriber-list.component';
import { StbAssignComponent } from './stb-assign/stb-assign.component';
import { StbAssignListComponent } from './stb-assign/stb-assign-list.component';
import { PackageAssignComponent } from './package-assign/package-assign.component';
import { CardPairingComponent } from './card-pairing/card-pairing.component';
import { BroadcasterComponent } from './broadcaster/broadcaster.component';
import { ChannelCategoryComponent } from './channel-category/channel-category.component';
import { ChannelSetupComponent } from './channel-setup/channel-setup.component';
import { PackageCreateComponent } from './package-create/package-create.component';
import { PanelModule } from 'primeng/panel';
import { TestComponent } from './test/test.component';
import { SubscriberPackageComponent } from './subscriber-package/subscriber-package.component';
import { SingleOsdComponent } from './single-osd/single-osd.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { PackageRenewComponent } from './package-renew/package-renew.component';
import { DeviceAssignComponent } from './device-assign/device-assign.component';
import { DeviceReturnComponent } from './device-return/device-return.component';
import { ReportViewerModule } from '../reportviewer/reportviewer.module';
import { TransferSubscriberComponent } from './transfer-subscriber/transfer-subscriber.component';
import { MessageSetupComponent } from './message-setup/message-setup.component';
import { MessageTypeComponent } from './message-type/message-type.component';
import { DirectiveModule } from '../directives/directive.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { SubscriptionProfileComponent } from './subscription-profile/subscription-profile.component';
import { PackageToggleComponent } from './package-toggle/package-toggle.component';
import { PackageExpiredComponent } from './package-expired/package-expired.component';
@NgModule({
  declarations: [
    AddSubscriberComponent,
    StbAssignComponent,
    PackageAssignComponent,
    CardPairingComponent,
    SubscriberListComponent,
    StbAssignListComponent,
    BroadcasterComponent,
    ChannelCategoryComponent,
    ChannelSetupComponent,
    PackageCreateComponent,
    SubscriberPackageComponent,
    TestComponent,
    SingleOsdComponent,
    MessageTemplateComponent,
    PackageRenewComponent,
    DeviceAssignComponent,
    DeviceReturnComponent,
    TransferSubscriberComponent,
    MessageSetupComponent,
    MessageTypeComponent,
    SubscriptionProfileComponent,
    PackageToggleComponent,
    PackageExpiredComponent
  ],
  imports: [
    ReportViewerModule,
    CommonModule,
    TranslateModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule, ConfirmDialogModule,
    MessagesModule, DialogModule, RadioButtonModule,
    SubscriberManagementRoutingModule, TabViewModule, PanelModule, DirectiveModule,ProgressSpinnerModule,SelectButtonModule,AccordionModule
  ]
})
export class SubscriberManagementModule { }
