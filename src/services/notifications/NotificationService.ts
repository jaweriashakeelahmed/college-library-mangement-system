import { AppNotification } from '@/src/types';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';

export class NotificationService {
  static async send(notification: Omit<AppNotification, 'id' | 'createdAt' | 'deliveryStatus' | 'retryCount'>) {
    try {
      const newNotif = {
        ...notification,
        createdAt: new Date().toISOString(),
        deliveryStatus: {
          inApp: 'Created',
          email: notification.deliveryChannels.includes('Email') ? 'Queued' : 'Delivery Unknown',
          whatsapp: notification.deliveryChannels.includes('WhatsApp') ? 'Link Generated' : 'Delivery Unknown',
          sms: notification.deliveryChannels.includes('SMS') ? 'Not Configured' : 'Not Configured'
        },
        retryCount: 0
      };
      
      const docRef = await addDoc(collection(db, 'notifications'), newNotif);
      return docRef.id;
    } catch (e) {
      console.error('Error sending notification', e);
      return null;
    }
  }

  static async markAsRead(id: string) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true, 'deliveryStatus.inApp': 'Read' });
    } catch (e) {
      console.error('Error marking as read', e);
    }
  }

  static async markAsUnread(id: string) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: false, 'deliveryStatus.inApp': 'Created' });
    } catch (e) {
      console.error('Error marking as unread', e);
    }
  }

  static async delete(id: string) {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.error('Error deleting notification', e);
    }
  }
}
