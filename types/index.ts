export type AuthType = "web2" | "web3"

export interface ThemeOption {
  id: string;
  label: string;
  type: "color" | "string" | "boolean";
  value: any;
}
