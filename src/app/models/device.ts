export class Device{
    id:string;
    appid:string;
    username:string;
    password:string;
    did:string;
    passcode:string;
    mac: string;
    productName:string;
    productType:string;
    note:string;
    isUse:boolean;
    createdAt:Date;
    updatedAt:Date;

    constructor(){
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isUse = false;
    }

}
