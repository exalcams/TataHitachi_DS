import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DSSConfiguration, CertificateClass, UserByPlant, AuthorityClass } from 'app/models/dss';
import { DashboardService } from 'app/services/dashboard.service';
import { MasterService } from 'app/services/master.service';
import { DISABLED } from '@angular/forms/src/model';
import { PlantView, DocumentTypeView, OutputTypeView } from 'app/models/master';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
    showExtraToFields: boolean;
    ConfigurationFormGroup: FormGroup;
    // AllDocumentTypeNames: string[] = [];
    AllOutputTypes: OutputTypeView[] = [];
    AllUserEmails: string[] = [];
    AllPlants: PlantView[] = [];
    AllFilteredPlants: PlantView[] = [];
    // AllDocumentTypes: DocumentTypeView[] = [];
    // AllFilteredDocumentTypes: DocumentTypeView[] = [];
    AllAuthority: AuthorityClass[] = [];
    AllUsersByPlant: UserByPlant[] = [];
    AllFilteredUsersByPlant: UserByPlant[] = [];
    AllCertificates: CertificateClass[] = [];
    CurrentDSSConfiguration: DSSConfiguration[] = [];
    SelectOutPutType: string;
    constructor(
        public matDialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DSSConfigurationData: DSSConfiguration,
        private formBuilder: FormBuilder,
        private dashboardService: DashboardService,
        private masterService: MasterService
    ) {
        // Set the defaults
        this.ConfigurationFormGroup = this.formBuilder.group({
            // AutoSign: ['', Validators.required],
            DocumentType: ['', Validators.required],
            Config1: ['', Validators.required],
            Config2: ['', Validators.required],
            Config3: ['', Validators.required],
            Authority: ['', Validators.required],
            // CertificateName: ['', Validators.required],
            ExpiryDate: ['', Validators.required],
            DisplayTitle1: ['', Validators.required],
            DisplayTitle2: ['']
        });
        // this.CurrentDSSConfiguration = new DSSConfiguration();
        this.showExtraToFields = false;
    }
    ResetControl(): void {
        this.ConfigurationFormGroup.reset();
        Object.keys(this.ConfigurationFormGroup.controls).forEach(key => {
            this.ConfigurationFormGroup.get(key).markAsUntouched();
        });
    }
    ngOnInit(): void {
        // this.GetAllCertificateFromStore();
        this.GetAllAuthoritys();
        console.log(this.DSSConfigurationData);
        if (this.DSSConfigurationData) {
            this.ConfigurationFormGroup.setValue({
                // AutoSign: this.DSSConfigurationData.AUTOSIGN ? '1' : '0',
                // SignedAuthority: this.DSSConfigurationData.AUTHORITY,
                 DocumentType: this.DSSConfigurationData.CONFIG2,
                Config1: this.DSSConfigurationData.CONFIG1,
                Config2: this.DSSConfigurationData.CONFIG2,
                Config3: this.DSSConfigurationData.CONFIG3,
                // Config3: this.SelectOutPutType,
                Authority: this.DSSConfigurationData.AUTHORITY,
                // CertificateName: this.DSSConfigurationData.CERT_NAME,
                ExpiryDate: this.DSSConfigurationData.CERT_EX_DT,
                DisplayTitle1: this.DSSConfigurationData.DISPLAYTITLE1,
                DisplayTitle2: this.DSSConfigurationData.DISPLAYTITLE2
            });
        } else {
            this.DSSConfigurationData = new DSSConfiguration();
            this.ResetControl();
            //  this.ConfigurationFormGroup.get('AutoSign').patchValue('1');
        }
    }

    GetAllAuthoritys(): void {
        this.masterService.GetAllAuthority().subscribe(
            data => {
                this.AllAuthority = <AuthorityClass[]>data;
                // console.log(this.AllMenuApps);
                // this.AllDocumentTypeNameCompleted = true;
            },
            err => {
                console.error(err);
                // this.AllDocumentTypeNameCompleted = true;
            }
        );
    }

    GetAllUserEmails(): void {
        this.dashboardService.GetAllUserEmails().subscribe(
            data => {
                this.AllUserEmails = data as string[];
            },
            err => {
                console.error(err);
            }
        );
    }

    SignedAuthoritySelected(SignedAuthority: string): void {
        console.log(SignedAuthority);
        const res = this.AllAuthority.filter(x => x.UserName === SignedAuthority)[0];
        if (res) {
        }
    }

    // GetAllCertificateFromStore(): void {
    //     this.dashboardService.GetAllCertificateFromStore().subscribe(
    //         (data) => {
    //             this.AllCertificates = data as CertificateClass[];
    //             if (this.AllCertificates && this.AllCertificates.length > 0) {
    //                 if (this.DSSConfigurationData && this.DSSConfigurationData.CONFIG2) {
    //                 } else {
    //                     this.ConfigurationFormGroup.get('CertificateName').patchValue(this.AllCertificates[0].CertificateName);
    //                     this.ConfigurationFormGroup.get('ExpiryDate').patchValue(this.AllCertificates[0].ExpiryDate);
    //                 }
    //             }
    //         },
    //         (err) => {
    //             console.error(err);
    //         }
    //     );
    // }

    // GetExpiryDate(cert: string): void {
    //     // const cert = this.ConfigurationFormGroup.get('CertificateName').value;
    //     if (cert) {
    //         const filteredCert = this.AllCertificates.filter(x => x.CertificateName === cert)[0];
    //         if (filteredCert) {
    //             const exp = filteredCert.ExpiryDate;
    //             if (exp) {
    //                 this.ConfigurationFormGroup.get('ExpiryDate').patchValue(exp);
    //                 // this.DSSConfigurationData.CERT_EX_DT = exp;
    //             }
    //         }
    //     }
    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    YesClicked(): void {
        if (this.ConfigurationFormGroup.valid) {
            // this.DSSConfigurationData.DOCTYPE = this.ConfigurationFormGroup.get('DocumentType').value;
            // this.DSSConfigurationData.Plant_ID = this.ConfigurationFormGroup.get('Plant').value;
            this.DSSConfigurationData.CONFIG1 = this.ConfigurationFormGroup.get('Config1').value;
            this.DSSConfigurationData.CONFIG2 = this.ConfigurationFormGroup.get('Config2').value;
            this.DSSConfigurationData.CONFIG3 = this.ConfigurationFormGroup.get('Config3').value;
            this.DSSConfigurationData.AUTOSIGN = false;
            // this.DSSConfigurationData.AUTHORITY = this.ConfigurationFormGroup.get('SignedAuthority').value;
            this.DSSConfigurationData.CERT_NAME = 'Dongle';
            this.DSSConfigurationData.CERT_EX_DT = this.ConfigurationFormGroup.get('ExpiryDate').value;
            this.DSSConfigurationData.AUTHORITY = this.ConfigurationFormGroup.get('Authority').value;
            this.DSSConfigurationData.DISPLAYTITLE1 = this.ConfigurationFormGroup.get('DisplayTitle1').value;
            this.DSSConfigurationData.DISPLAYTITLE2 = this.ConfigurationFormGroup.get('DisplayTitle2').value;
            this.matDialogRef.close(this.DSSConfigurationData);
        } else {
            Object.keys(this.ConfigurationFormGroup.controls).forEach(key => {
                this.ConfigurationFormGroup.get(key).markAsTouched();
                this.ConfigurationFormGroup.get(key).markAsDirty();
            });
        }
    }

    CloseClicked(): void {
        this.matDialogRef.close(null);
    }
    GetDocumentType(documentType: string): void {
        this.ConfigurationFormGroup.controls['Config2'].setValue(documentType);
    }
}
