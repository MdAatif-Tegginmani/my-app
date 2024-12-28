// export interface User {
//   id: number;
//   name: string;
//   time: string;
//   address: string;
// }

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



export interface TableColumn {
  id: number;
  name: string;
  columnId: string;
  icon: JSX.Element | null;
}

export interface TableRow {
  [key: string]: string | null;
}

