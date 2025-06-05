export type IMenuItem = {
  key: string;
  label: string;
};

export type ICoordinate = {
  lat: number;
  lng: number;
};

export type IAuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  npi: string;
  activated: boolean;
  role: string;
  phone: string;
  specialty: string;
  needFinancing: boolean;
  hasPassword: boolean;
};
