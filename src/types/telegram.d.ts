export interface ITelegramInitData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    allows_write_to_pm: boolean;
  };
  auth_date: number;
  start_param: string;
  chat_type: string;
  chat_instance: number;
  hash: string;
}
