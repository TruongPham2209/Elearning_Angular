interface SemesterRequest {
  name: string;
  startDate: Date;
  endDate: Date;
}

interface SemesterResponse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export type { SemesterRequest, SemesterResponse };