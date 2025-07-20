

export interface INotification {
    "id": number;
    "text": string;
    "title": string;
    "userId": number;
    "isRead": boolean | null;
    "createdAt": string;
    "updated": string;
}