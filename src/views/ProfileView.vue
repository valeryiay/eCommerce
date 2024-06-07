<script lang="ts">
    import { mergeProps } from "vue";
    import type { Customer, CustomerWithToken, DateOfBirthFormat, FullCustomerAddress } from "@/types";
    import { COUNTRIES } from "@/constants";
    import { formatDateOfBirth } from "@/utils/formatDateOfBirth";
    import { ValidationRules } from "@/utils/validationRules";
    import { useAuthStore } from "@/store";
    import { changePassword, removeAddress, updateUser } from "@/services/commercetoolsApi";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            customerTabs: null,
            editGeneralDetails: {
                isDialogOpen: false,
                form: false,
                loading: false,
                isSubmitError: false,
                errorMessage: "",
                dateOfBirth: null as Date | null,
                isDateOfBirthMenuOpen: false,
                isCurrPasswordVisible: false,
                isCurrPasswordInvalid: false,
                isCurrPasswordInputFocused: false,
                isNewPasswordVisible: false,
                isOperationSuccessDisplayed: false
            },
            generalCustomerInfoModel: {
                firstName: "",
                lastName: "",
                email: "",
                dateOfBirth: "",
                currPassword: "",
                newPassword: ""
            },
            addressDetails: {
                dialogAddressDelete: false,
                editAddressItem: null as FullCustomerAddress | null
            },
            commonValidationRules: ValidationRules,
            notification: {
                isDisplay: false,
                message: ""
            }
        }),
        methods: {
            mergeProps,
            formatBirthDate(date: string | null): string {
                if (!date) {
                    return "N/A";
                }

                return new Date(date)
                    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            },
            getColorForAddressType(addressType: string): string {
                if (addressType.includes("Default")) {
                    return "blue";
                }

                return "";
            },
            formatGeneralInfoModelDate (date: Date | null): string {
                const formattedDateOfBirth: DateOfBirthFormat = formatDateOfBirth(date);

                this.generalCustomerInfoModel.dateOfBirth = formattedDateOfBirth.serviceFormat;

                return formattedDateOfBirth.uiFormat;
            },
            diffCustomerDetailsFieldsToUpdate(): any[] {
                const diff = [];

                if (this.generalCustomerInfoModel.firstName !== (this.authStore?.user?.user?.firstName || "")) {
                    diff.push({
                        action: "setFirstName",
                        firstName: this.generalCustomerInfoModel.firstName
                    });
                }

                if (this.generalCustomerInfoModel.lastName !== (this.authStore?.user?.user?.lastName || "")) {
                    diff.push({
                        action: "setLastName",
                        lastName: this.generalCustomerInfoModel.lastName
                    });
                }

                if (this.generalCustomerInfoModel.dateOfBirth !== (this.authStore?.user?.user?.dateOfBirth || "")) {
                    diff.push({
                        action: "setDateOfBirth",
                        dateOfBirth: this.generalCustomerInfoModel.dateOfBirth
                    });
                }

                return diff;
            },
            diffCustomerEmailAndPasswordToUpdate(): any[] {
                const diff = [];

                if (this.generalCustomerInfoModel.email !== (this.authStore?.user?.user?.email || "")) {
                    diff.push({
                        action: "changeEmail",
                        email: this.generalCustomerInfoModel.email
                    });
                }

                if (this.generalCustomerInfoModel.newPassword !== (this.authStore?.user?.user?.password || "")) {
                    diff.push({
                        action: "changePassword",
                        password: this.generalCustomerInfoModel.currPassword,
                        passwordNew: this.generalCustomerInfoModel.newPassword
                    });
                }

                return diff;
            },
            onCustomerDetailsDialogOpen() {
                this.generalCustomerInfoModel.firstName = this.authStore?.user?.user?.firstName || "";
                this.generalCustomerInfoModel.lastName = this.authStore?.user?.user?.lastName || "";
                this.generalCustomerInfoModel.email = this.authStore?.user?.user?.email || "";
                this.generalCustomerInfoModel.newPassword = this.authStore?.user?.user?.password || "";
                this.generalCustomerInfoModel.currPassword = "";

                this.generalCustomerInfoModel.dateOfBirth = this.authStore?.user?.user?.dateOfBirth || "";
                this.editGeneralDetails.dateOfBirth = new Date(this.generalCustomerInfoModel.dateOfBirth);

                this.editGeneralDetails.isCurrPasswordVisible = false;
                this.editGeneralDetails.isNewPasswordVisible = false;
                this.editGeneralDetails.isNewPasswordVisible = false;

                this.editGeneralDetails.loading = false;
                this.editGeneralDetails.isSubmitError = false;

                this.editGeneralDetails.isDialogOpen = true;
            },
            onCustomerDetailsPasswordInput() {
                if (this.editGeneralDetails.isCurrPasswordInvalid) {
                    this.editGeneralDetails.isCurrPasswordInvalid = false;
                    this.editGeneralDetails.isSubmitError = false;
                    this.editGeneralDetails.errorMessage = "";
                }
            },
            displayOperationSuccess() {
                this.editGeneralDetails.isOperationSuccessDisplayed = true;

                setTimeout(() => {
                    this.editGeneralDetails.isOperationSuccessDisplayed = false;
                }, 5000);
            },
            async onCustomerDetailsFormSubmit() {
                if (!this.editGeneralDetails.form) {
                    return;
                }

                this.editGeneralDetails.loading = true;
                this.editGeneralDetails.isSubmitError = false;

                const formGeneralDetailsDiff = this.diffCustomerDetailsFieldsToUpdate();
                const formLoginAndPasswordDiff = this.diffCustomerEmailAndPasswordToUpdate();

                if (formGeneralDetailsDiff.length === 0 && formLoginAndPasswordDiff.length == 0) {
                    this.editGeneralDetails.loading = false;

                    return;
                }

                const { id, version } = this.authStore.user!.user!;
                const { cart, token} = this.authStore.user!;

                try {
                    // General details update, like First Name, Last Name, Bay of Birth
                    if (formGeneralDetailsDiff.length !== 0) {
                        const updatedUserData: Customer | Error = await updateUser(formGeneralDetailsDiff, id, token.access_token, version);

                        if (updatedUserData instanceof Error) {
                            throw new Error(updatedUserData.message);
                        }

                        this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                    }

                    // Login and password update
                    if (formLoginAndPasswordDiff.length !== 0) {
                        // See if credential are valid
                        const isValidCredentials = await this.authStore.isValidCredentials({
                            email: this.authStore.user!.user!.email,
                            password: this.generalCustomerInfoModel.currPassword
                        });

                        if (!isValidCredentials) {
                            this.editGeneralDetails.isCurrPasswordInvalid = true;
                            this.editGeneralDetails.form = false;

                            // Toggle focus
                            this.editGeneralDetails.isCurrPasswordInputFocused = true;
                            setTimeout(() => {
                                this.editGeneralDetails.isCurrPasswordInputFocused = false;
                            }, 200);

                            throw new Error("Current Password is invalid");
                        }

                        // If email up to update, update it first
                        const emailObj = formLoginAndPasswordDiff.find((item) => item.action === "changeEmail");

                        if (emailObj) {
                            const updatedUserData: Customer | Error = await updateUser(
                                [{ action: `${ emailObj.action }`, email: `${ emailObj.email }` }],
                                id,
                                token.access_token,
                                version
                            );

                            if (updatedUserData instanceof Error) {
                                throw new Error(updatedUserData.message);
                            }

                            this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                        }

                        // Next up is the password to update, if present
                        const passwordObj = formLoginAndPasswordDiff.find((item) => item.action === "changePassword");

                        if (passwordObj) {
                            const updatedUserData: CustomerWithToken | Error = await changePassword(
                                { password: `${ passwordObj.password }`, passwordNew: `${ passwordObj.passwordNew }` },
                                this.generalCustomerInfoModel.email,
                                id,
                                token.access_token,
                                version
                            );

                            if (updatedUserData instanceof Error) {
                                throw new Error(updatedUserData.message);
                            }

                            this.authStore.updateUserData(updatedUserData);
                        }
                    }

                    this.editGeneralDetails.loading = false;
                    this.displayOperationSuccess();
                }
                catch (error) {
                    this.editGeneralDetails.isSubmitError = true;
                    this.editGeneralDetails.errorMessage = String(error);

                    setTimeout(() => {
                        this.editGeneralDetails.loading = false;
                    }, 500);
                }
            },
            editAddressItem(item: FullCustomerAddress) {
                this.addressDetails.editAddressItem = item;
                this.notification.message = "";

                console.log("Edit:", item);
            },
            deleteAddressItem(item: FullCustomerAddress) {
                this.notification.message = "";
                this.addressDetails.editAddressItem = item;
                this.addressDetails.dialogAddressDelete = true;
            },
            closeAddressDeleteDialog() {
                this.addressDetails.editAddressItem = null;
                this.addressDetails.dialogAddressDelete = false;
            },
            async deleteAddressItemConfirm() {
                const { id, version } = this.authStore.user!.user!;
                const { cart, token} = this.authStore.user!;

                try {
                    const updatedUserData: Customer | Error = await removeAddress(
                        this.addressDetails.editAddressItem!.id,
                        id,
                        token.access_token,
                        version
                    );

                    if (updatedUserData instanceof Error) {
                        throw new Error(updatedUserData.message);
                    }

                    this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                } catch(error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }

                this.addressDetails.editAddressItem = null;
                this.addressDetails.dialogAddressDelete = false;
            }
        },
        computed: {
            customerAddressesTableHeaders(): Object[] {
                return [
                    {
                        title: "Contact Name",
                        key: "contactName",
                        value: (item: FullCustomerAddress) => `${ item.firstName } ${ item.lastName }`
                    },
                    {
                        title: "Country",
                        key: "country",
                        value: (item: FullCustomerAddress) => {
                            const country = COUNTRIES.find((c) => c.code == item.country);

                            if (!country) {
                                return item.country;
                            }

                            return country.title;
                        }
                    },
                    {
                        title: "City",
                        key: "city",
                        value: (item: FullCustomerAddress) =>
                            `${ item.city || "" }${ item.state ? "," : "" } ${ item.state || "" }`
                    },
                    {
                        title: "Address",
                        key: "address",
                        value: (item: FullCustomerAddress) =>
                            `${ item.streetName } ${ item.streetNumber }`
                    },
                    { title: "Postal Code", value: "postalCode" },
                    {
                        title: "Address Type",
                        key: "addressType",
                        value: (item: FullCustomerAddress) => {
                            const isShippingAddress = this.authStore?.user?.user?.shippingAddressIds.includes(item.id);
                            const isShippingAddressDefault = this.authStore?.user?.user?.defaultShippingAddressId === item.id;

                            if (isShippingAddress) {
                                return `Shipping ${ isShippingAddressDefault ? "(Default)" : "" }`;
                            }

                            const isBillingAddress = this.authStore?.user?.user?.billingAddressIds.includes(item.id);
                            const isBillingAddressDefault = this.authStore?.user?.user?.defaultBillingAddressId === item.id;

                            if (isBillingAddress) {
                                return `Billing ${ isBillingAddressDefault ? "(Default)" : "" }`;
                            }

                            return "";
                        }
                    },
                    {
                        title: "Actions",
                        key: "actions",
                        sortable: false
                    }
                ];
            },
            computedGeneralInfoModelDateFormatted(): string {
                return this.formatGeneralInfoModelDate(this.editGeneralDetails.dateOfBirth);
            },
            computedIsNewPasswordRequired(): boolean {
                return this.generalCustomerInfoModel.newPassword !== this.authStore!.user!.user!.password;
            },
            computedIsCustomerGeneralDataChanged(): boolean {
                return this.generalCustomerInfoModel.firstName !== this.authStore!.user!.user!.firstName ||
                       this.generalCustomerInfoModel.lastName !== this.authStore!.user!.user!.lastName ||
                       this.generalCustomerInfoModel.dateOfBirth !== this.authStore!.user!.user!.dateOfBirth ||
                       this.generalCustomerInfoModel.email !== this.authStore!.user!.user!.email ||
                       this.generalCustomerInfoModel.newPassword !== this.authStore!.user!.user!.password;
            }
        }
    };
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-sheet rounded="lg">
                    <v-row>
                        <v-col cols="1" class="customer-avatar-column">
                            <v-card
                                min-width="200"
                                min-height="200"
                                flat
                            >
                                <v-avatar
                                    class="mx-auto customer-avatar"
                                    color="grey-darken-3"
                                    size="200"
                                    rounded="0"
                                >
                                    <img
                                        height="100%"
                                        min-width="200"
                                        alt="Default profile image"
                                        src="@/assets/img/default-avatar.svg"
                                    >
                                </v-avatar>
                            </v-card>
                        </v-col>

                        <v-col>
                            <h2 class="text-h4 font-weight-black">{{ authStore?.user?.user?.firstName }} {{ authStore?.user?.user?.lastName }}</h2>
                            <p
                                v-if="authStore?.user?.user?.dateOfBirth"
                                class="text-h6"
                            >
                                <v-icon icon="mdi-cake-layered"></v-icon>
                                <span class="birthday-text ml-2">Cake Day: {{ formatBirthDate(authStore?.user?.user?.dateOfBirth) }}</span>
                            </p>
                        </v-col>

                        <v-btn
                            @click="onCustomerDetailsDialogOpen()"
                            class="text-none font-weight-regular mt-3 mr-3"
                            prepend-icon="mdi-account"
                            variant="tonal"
                            text="Edit Profile"
                        ></v-btn>

                        <v-dialog
                            v-model="editGeneralDetails.isDialogOpen"
                            max-width="600"
                        >
                            <v-form v-model="editGeneralDetails.form" @submit.prevent="onCustomerDetailsFormSubmit">
                                <v-card
                                    prepend-icon="mdi-account"
                                    title="User Profile"
                                >
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.firstName"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.noSpecialChar,
                                                        commonValidationRules.minLength(2, 'First name must be at least 2 character long')
                                                    ]"
                                                    label="First name"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.lastName"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.noSpecialChar,
                                                        commonValidationRules.minLength(2, 'Last name must be at least 2 character long')
                                                    ]"
                                                    label="Last name"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4" sm="6">
                                                <v-menu
                                                    v-model="editGeneralDetails.isDateOfBirthMenuOpen"
                                                    :close-on-content-click="false"
                                                    transition="scale-transition"
                                                >
                                                    <template v-slot:activator="{ props }">
                                                        <v-text-field
                                                            v-model="computedGeneralInfoModelDateFormatted"
                                                            v-bind="props"
                                                            :rules="[commonValidationRules.required, commonValidationRules.ageLimit]"
                                                            label="Day of Birth"
                                                            readonly
                                                        >
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editGeneralDetails.dateOfBirth"></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>

                                        <v-row dense>
                                            <v-col cols="8" md="8" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.email"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.isProperEmail,
                                                        commonValidationRules.isEmailWithDomain,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.isEmailProperlyFormatted
                                                    ]"
                                                    label="Email"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="4" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.newPassword"
                                                    :rules="computedIsNewPasswordRequired ? [
                                                        commonValidationRules.required,
                                                        commonValidationRules.minLength(8, 'Min 8 characters'),
                                                        commonValidationRules.minOneDigit,
                                                        commonValidationRules.minOneLowerCase,
                                                        commonValidationRules.minOneUpperCase,
                                                        commonValidationRules.minOneSpecialChar,
                                                        commonValidationRules.noLeadingTrailingWhitespace
                                                    ] : []"
                                                    label="Password"
                                                    :append-inner-icon="editGeneralDetails.isNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    :type="editGeneralDetails.isNewPasswordVisible ? 'text' : 'password'"
                                                    @click:append-inner="editGeneralDetails.isNewPasswordVisible = !editGeneralDetails.isNewPasswordVisible"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row dense>
                                            <v-col cols="12" md="8" sm="6">
                                                <v-text-field
                                                    v-if="diffCustomerEmailAndPasswordToUpdate().length > 0"
                                                    v-model="generalCustomerInfoModel.currPassword"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.minLength(8, 'Min 8 characters'),
                                                        commonValidationRules.minOneDigit,
                                                        commonValidationRules.minOneLowerCase,
                                                        commonValidationRules.minOneUpperCase,
                                                        commonValidationRules.minOneSpecialChar,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        () => !editGeneralDetails.isCurrPasswordInvalid || 'Provided Password is invalid'
                                                    ]"
                                                    :append-inner-icon="editGeneralDetails.isCurrPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    :type="editGeneralDetails.isCurrPasswordVisible ? 'text' : 'password'"
                                                    :focused="editGeneralDetails.isCurrPasswordInputFocused"
                                                    hint="Required if you want to change the e-mail address or specify a new password"
                                                    @click:append-inner="editGeneralDetails.isCurrPasswordVisible = !editGeneralDetails.isCurrPasswordVisible"
                                                    @keyup="onCustomerDetailsPasswordInput"
                                                    label="Current Password"
                                                    persistent-hint
                                                    required
                                                    clearable
                                                >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>

                                    <v-divider v-if="editGeneralDetails.isSubmitError"></v-divider>

                                    <v-card
                                        v-if="editGeneralDetails.isSubmitError"
                                        class="mb-10 text-center"
                                        color="surface-variant"
                                        variant="tonal"
                                    >
                                        <v-card-text class="text-medium-emphasis text-error font-weight-bold">
                                            <h1>Unable to submit form</h1>
                                            <p>The information you entered is incomplete or invalid.</p>
                                            <br>
                                            <p v-if="editGeneralDetails.errorMessage">For geeks, {{ editGeneralDetails.errorMessage }}</p>
                                        </v-card-text>
                                    </v-card>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-chip
                                            v-if="editGeneralDetails.isOperationSuccessDisplayed"
                                            color="teal"
                                            class="float-start"
                                            prepend-icon="mdi-checkbox-marked-circle"
                                        >
                                            Saved Successfully
                                        </v-chip>

                                        <v-spacer></v-spacer>

                                        <v-btn
                                            text="Close"
                                            variant="plain"
                                            @click="editGeneralDetails.isDialogOpen = false"
                                        ></v-btn>

                                        <v-btn
                                            :disabled="!computedIsCustomerGeneralDataChanged || !editGeneralDetails.form"
                                            :loading="editGeneralDetails.loading"
                                            type="submit"
                                            color="primary"
                                            text="Save"
                                            variant="tonal"
                                        ></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-dialog>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-sheet
                    min-height="50vh"
                    rounded="lg"
                >
                    <v-tabs
                        v-model="customerTabs"
                        color="white"
                        slider-color="#f78166"
                        align-tabs="center"
                    >
                        <v-tab value="addresses">Addresses</v-tab>
                        <v-tab value="orders">Orders</v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="customerTabs">
                        <v-tabs-window-item value="addresses">
                            <v-card>
                                <v-data-table
                                    :headers="customerAddressesTableHeaders"
                                    :items="authStore?.user?.user?.addresses"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.addressType`]="{ value }">
                                        <v-chip :color="getColorForAddressType(value)">{{ value  }}</v-chip>
                                    </template>
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon
                                            class="me-2"
                                            size="small"
                                            @click="editAddressItem(item as FullCustomerAddress)"
                                        >
                                            mdi-pencil
                                        </v-icon>
                                        <v-icon
                                            size="small"
                                            @click="deleteAddressItem(item as FullCustomerAddress)"
                                        >
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                </v-data-table>
                                <v-dialog v-model="addressDetails.dialogAddressDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue-darken-1" variant="text" @click="closeAddressDeleteDialog">Cancel</v-btn>
                                            <v-btn color="blue-darken-1" variant="text" @click="deleteAddressItemConfirm">OK</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-card>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="orders">
                            <v-card>
                                <v-card-text>This feature is coming in the next release</v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-sheet>
            </v-col>
        </v-row>
        <v-snackbar v-model="notification.isDisplay" multi-line>
            {{ notification.message }}

            <template v-slot:actions>
                <v-btn
                    color="red"
                    variant="text"
                    @click="notification.isDisplay = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<style scoped>
    .v-row {
        margin: 0;
    }

    .customer-avatar-column {
        display: inline-table;
    }

    .customer-avatar {
        border-radius: 5% !important;
    }

    .birthday-text {
        position: relative;
        bottom: -8px;
    }
</style>
