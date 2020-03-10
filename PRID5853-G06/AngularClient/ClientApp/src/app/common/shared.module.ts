import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
    MatListModule, MatDividerModule, MatProgressSpinnerModule, MatExpansionModule, MatButtonToggleModule,
    MatBadgeModule, MatChipsModule, MatAutocompleteModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
        MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
        MatSelectModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
        MatListModule, MatDividerModule, MatProgressSpinnerModule, MatExpansionModule, MatButtonToggleModule,
        MatBadgeModule, MatChipsModule, MatAutocompleteModule
    ],
    exports: [
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
        MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
        MatSelectModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
        MatListModule, MatDividerModule, MatProgressSpinnerModule, MatExpansionModule, MatButtonToggleModule,
        MatBadgeModule, MatChipsModule, MatAutocompleteModule
    ],
})

export class SharedModule { }
