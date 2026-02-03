export interface CreateAuthorizedPersonCommand {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  childIds: string[];
}
