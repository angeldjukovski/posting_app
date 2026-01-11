import { UserRole } from "./user.enum"

export interface User {
id: number,
username : string,
email : string, 
firstName : string,
lastName : string,
password : string
role : UserRole.Poster
createdAt: Date;
}