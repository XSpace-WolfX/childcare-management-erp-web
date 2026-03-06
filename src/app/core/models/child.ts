export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  familyId: string;
}

export interface CreateChildCommand {
  firstName: string;
  lastName: string;
  birthDate: Date;
}

export interface UpdateChildCommand {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
}
