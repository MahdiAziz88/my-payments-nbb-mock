export interface Transaction {
    id: number;
    debitAccount: number;
    accountName: string;
    transactionAmount: number;
    transactionType: string; // 'FP' 'FT' FA'
    initiatingChannel: string;
    transactionInitiationDate: string;
    referenceNumber: string;
    beneficiaryName: string;
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
