import {NgModule} from "@angular/core";
import {WizardSumupComponent} from "./wizard-sumup/wizard-sumup.component";
import {WizardBook} from "./services/wizard-book";
import {WizardRouting} from "./services/wizard-routing";
import {DevExtremeModule} from "devextreme-angular";
import {WizardListAuthorsComponent} from "./wizard-list-authors/wizard-list-authors.component";
import {WizardListEditorsComponent} from "./wizard-list-editors/wizard-list-editors.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        DevExtremeModule
    ],
    declarations: [
        WizardListAuthorsComponent,
        WizardListEditorsComponent,
        WizardSumupComponent,
    ],
    exports: [
        CommonModule,
        DevExtremeModule,
        WizardListAuthorsComponent,
        WizardListEditorsComponent,
        WizardSumupComponent
    ],
    providers: [
        WizardRouting,
        WizardBook
    ]
})
export class SharedModule {
}
