export enum Role {
  Member = 0,
  Manager = 1,
  Admin = 2
}
export class User {
    id : number;
    pseudo: string;
    password: string;
    email:string;
    firstName:string;
    lastName:string;
    birthDate: Date;
    reputation:number;
    role: Role;
    token: string;

    

    constructor(id = 0, pseudo = "", password ="", email = "", firstname = "", lastname = "", birthDate = null, reputation = 0, role = Role.Member, token = "") {
        this.id = id;
        this.pseudo = pseudo;
        this.password = password;
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
        this.birthDate = birthDate;
        this.reputation = reputation;
        this.role = role;
        this.token = token;
    }
  public get roleAsString(): string {
    return Role[this.role];
  }
  
  }