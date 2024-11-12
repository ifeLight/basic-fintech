export enum TransactionStatus {
  PENDING = 'pending',
  SUCCCESS = 'success',
  FAILED = 'failed',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
}

export enum TransactionFlow {
  DEBIT = 'debit',
  CREDIT = 'credit',
}
