export interface ChildInGroup {
  id: string;
  firstName: string;
  lastName: string;
  group: string;
}

export interface GroupedChildren {
  groupName: string;
  children: ChildInGroup[];
  count: number;
}
