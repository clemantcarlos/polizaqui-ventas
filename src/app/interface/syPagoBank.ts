export interface bankOption {
    Code: string;
    Name: string;
    Active: boolean;
    SkypagoClient: boolean;
    VerifyType: boolean;
    IsSmsOtp: boolean;
    SmsOTPAddress: string;
    SmsOTPText: boolean;
    IsdebitOTP: boolean;
}

export interface PLan {
    name:string;
    costo_anual:string;
    coberturas:any
}

export const BankOptions : bankOption [] = []