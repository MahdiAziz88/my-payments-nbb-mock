export interface Transaction {
    id: number;
    debitAccount: string; // using string due to errors with leading zeros, will change if type cannot be string
    accountName?: string; // some accounts do not have account names? based on API response
    transactionAmount: number;
    transactionType: string; // 'FP' 'FT' FA'
    initiatingChannel: string;
    transactionInitiationDate: string;
    referenceNumber: string;
    beneficiaryName?: string; // some accounts do not have beneficiary names? based on API response
    beneficiaryIBAN: string;
    beneficiaryBIC: string;
    status: string; // 'Approved' 'Rejected' 'Pending'
    rejectionDescription?: string; // Optional as not all transactions have this field
    billerCode?: string;
    billerServiceCode?: string;
    billerSubServiceCode?: string;
    billerSubscriberType?: string;
    billerSubscriberIDNumber?: string;
}
