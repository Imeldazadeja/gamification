export interface Filter {
  where?: { [key: string]: any };
  skip?: number;
  limit?: number;
  populate?: Array<{ path: string; select?: Array<string> }>;
}
