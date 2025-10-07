export class AuthResponseDto {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
}
