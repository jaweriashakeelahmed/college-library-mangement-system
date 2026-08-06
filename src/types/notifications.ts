export interface AppNotification {
  id: string;
  recipientId: string;
  recipientRole: 'student' | 'staff' | 'admin' | 'principal' | 'librarian' | 'head_librarian';
  title: string;
  message: string;
  type: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: string;
  read: boolean;
  deliveryChannels: string[];
  deliveryStatus: {
    inApp: 'Created' | 'Read' | 'Deleted';
    email: 'Queued' | 'Sent' | 'Failed' | 'Provider Accepted' | 'Delivery Unknown';
    whatsapp: 'Link Generated' | 'Opened in WhatsApp' | 'Delivery Unknown';
    sms: 'Not Configured' | 'Queued' | 'Sent' | 'Failed';
  };
  retryCount: number;
  errorMessage?: string;
  actionUrl?: string;
  expiryDate?: string;
}
