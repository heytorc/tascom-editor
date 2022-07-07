export default interface IUserLoginResponse {
  _id: string;
  name: string;
  email: string;
  company?: string;
  system_id: string;
  access_token: string;
  active: boolean;
  type: "USER" | "ADMIN";
}