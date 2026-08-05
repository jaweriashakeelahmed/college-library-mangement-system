const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

const newTypes = `
export interface FineRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  reason: string;
  relatedRecordId?: string;
  dateIssued: string;
  dueDate?: string;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Waived' | 'Cancelled';
  amountPaid: number;
  waivedAmount: number;
  remarks?: string;
}

export interface PaymentRecord {
  id: string;
  fineId: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Card' | 'Manual';
  status: 'Completed' | 'Pending' | 'Failed';
  processedBy: string;
  receiptNumber: string;
  remarks?: string;
}

export interface FineSettings {
  finePerDay: number;
  gracePeriodDays: number;
  maxFine: number;
  lostBookProcessingFee: number;
  minorDamageFee: number;
  majorDamageFee: number;
  criticalDamageFee: number;
  membershipRenewalFee: number;
}
`;

code += newTypes;
fs.writeFileSync('src/types/index.ts', code);
