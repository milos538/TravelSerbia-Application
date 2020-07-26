export class trip {
  constructor
  (
    public name : string,
    public text : string,
    public type : string,
    public status : string,
    public price : number,
    public location : string,
    public image : string,
    public from : Date,
    public to : Date,
    public id : string,
    public students?: Array<{id:string,name:string,surname:string,star?:number,code?:string}>
  ){}

};