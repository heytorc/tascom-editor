export default interface IUserLoginResponse {
  id: string;
  name: string;
  email: string;
  company?: string;
  system_id: string;
  token: string;
  active: boolean;
  type: "USER" | "ADMIN";
}