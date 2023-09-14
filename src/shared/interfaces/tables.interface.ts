export interface TableI {
  page: number;
  limit: number;
  status: boolean;
  data: any;
  total: number;
  totalPages: number;
}

export interface PaymentsTableI extends TableI {
  totalPayments: string;
}
