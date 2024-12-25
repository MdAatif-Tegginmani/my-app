export interface User {
  id: number;
  name: string;
  time: string;
  address: string;
} 


export type StatusOption = {
    value: string;
    color: string;
  };
  
  export type LabelOption = {
    value: string;
    color: string;
  };
  
  export interface User {
    id: number;
    name: string;
    time: string;
    address: string;
  }
  
  export interface TableRowType {
    taskName: string;
    owner: string | User;
    dueDate: string;
    [key: string]: string | User | null;
  }