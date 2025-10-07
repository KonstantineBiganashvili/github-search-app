export class RepositoryDto {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  language: string | null;
  owner: {
    login: string;
    avatarUrl: string;
  };
}
