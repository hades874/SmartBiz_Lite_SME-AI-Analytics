
export interface SalesRecord {
    id: string;
    date: string; // ISO 8601
    productName: string;
    productId?: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    customerName?: string;
    customerId?: string;
    paymentStatus: 'paid' | 'pending' | 'partial';
    category?: string;
    customerAvatarUrl?: string;
  }
  
  export interface InventoryItem {
    id: string,
    productName: string;
    currentStock: number;
    unit: string;
    reorderLevel: number;
    status: 'ok' | 'low' | 'overstock';
    costPrice: number;
    sellingPrice: number;
    category?: string;
    lastRestocked?: string;
  }
  
  export interface Payment {
    id: string;
    date: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    status: 'completed' | 'pending' | 'scheduled';
    dueDate?: string;
    customerId?: string;
  }
  
  export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    firstPurchase: string | null;
    lastPurchase: string | null;
    totalPurchases: number;
    totalSpent: number;
    averageOrderValue: number;
    segment?: 'high-value' | 'regular' | 'at-risk' | 'lost';
  }
  
  export interface UserCredentials {
    email: string;
    password?: string;
  }
  
