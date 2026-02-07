export interface AuthorizedPerson {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface CreateAuthorizedPersonCommand {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  childIds: string[];
}

export interface AuthorizedPersonChildLink {
  authorizedPersonId: string;
  childId: string;
}
