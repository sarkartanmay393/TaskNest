export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type StoreGoogleIdPayload = {
  googleId: string;
  userId?: number;
};