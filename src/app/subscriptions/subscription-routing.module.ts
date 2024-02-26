import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { TestComponent } from './test/test.component';
import { SubscriberPackageComponent } from './subscriber-package/subscriber-package.component';
import { SingleOsdComponent } from './single-osd/single-osd.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { PackageRenewComponent } from './package-renew/package-renew.component';
import { DeviceAssignComponent } from './device-assign/device-assign.component';
import { DeviceReturnComponent } from './device-return/device-return.component';
import { TransferSubscriberComponent } from './transfer-subscriber/transfer-subscriber.component';
import { MessageSetupComponent } from './message-setup/message-setup.component';
import { MessageTypeComponent } from './message-type/message-type.component';
import { SubscriptionProfileComponent } from './subscription-profile/subscription-profile.component';
import { PackageToggleComponent } from './package-toggle/package-toggle.component';
import { PackageExpiredComponent } from './package-expired/package-expired.component';



const routes: Routes = [
  { path: "addSubscriber", component: AddSubscriberComponent },
  { path: "addSubscriber/:id", component: AddSubscriberComponent },
  { path: "subscriberlist", component: SubscriberListComponent },
  { path: "stbassign", component: StbAssignComponent },
  { path: "stbassignlist", component: StbAssignListComponent },
  { path: "packageassign", component: PackageAssignComponent },
  { path: "cardpairing", component: CardPairingComponent },
  { path: "broadcaster", component: BroadcasterComponent },
  { path: "channelcategory", component: ChannelCategoryComponent },
  { path: "channelsetup", component: ChannelSetupComponent },
  { path: "packagecreate", component: PackageCreateComponent },
  { path: "test", component: TestComponent },
  { path: "subscriber-package/:id", component: SubscriberPackageComponent },
  { path: "osd", component: SingleOsdComponent },
  { path: "message-setting", component: MessageSetupComponent },
  { path: "message-template", component: MessageTemplateComponent },
  { path: "package-renew", component: PackageRenewComponent },
  { path: "deviceassign", component: DeviceAssignComponent },
  { path: "devicereturn", component: DeviceReturnComponent },
  { path: "transfer", component: TransferSubscriberComponent },
  {path:"message-type",component:MessageTypeComponent},
  {path:"subscription-profile",component:SubscriptionProfileComponent},
  {path:"package-toggle",component:PackageToggleComponent},
  {path:"package-expired",component:PackageExpiredComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberManagementRoutingModule { }
