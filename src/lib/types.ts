
import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
};

export type Day = {
  date: Date;
  isToday: boolean;
  isPast: boolean;
};

export type Reservation = {
  date: string; // YYYY-MM-DD
  office: string[]; // array of user IDs
  online: string[]; // array of user IDs
};

export type WeeklyStatus = {
    week: number;
    content: string;
    status: 'draft' | 'published';
};

export type PortfolioItem = {
    id: string;
    userId: string;
    type: 'status' | 'project';
    title: string;
    description: string;
    date: string | Timestamp; // ISO string or Timestamp
    isVisible: boolean;
    // Status-specific
    weekOf?: string | Timestamp; // ISO string for start of week or Timestamp
    // Project-specific
    link?: string;
    technologies?: string[];
};

export type OrderItem = {
    id: string;
    userId: string | null; // Can be null for guest orders
    guestName?: string; // For guest orders
    name: string;
    details?: string;
    price: number;
    isPaid: boolean;
}

export type OrderItemData = Omit<OrderItem, 'id' | 'userId' | 'isPaid' | 'guestName'>;

export type VotingOption = {
    id: string;
    name: string;
    link?: string;
    votes: string[]; // array of user IDs
    addedById: string;
};

export type FoodOrder = {
    id: string;
    creatorId: string;
    companyName: string; // Also used for Voting Title
    isOpen: boolean;
    type: 'order' | 'voting';
    createdAt: Timestamp;
    deadline?: string; // ISO string for the deadline
    description?: string; // For voting events
    // Order specific
    link?: string;
    creatorPhoneNumber?: string;
    orders: OrderItem[];
    // Voting specific
    votingOptions?: VotingOption[];
};
