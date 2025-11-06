
'use server';

import { google } from 'googleapis';
import { InventoryItem, Customer, SalesRecord, UserCredentials } from '@/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// INVENTORY FUNCTIONS
const INVENTORY_SHEET_NAME = 'Inventory';
const INVENTORY_HEADERS = ['id', 'productName', 'currentStock', 'unit', 'reorderLevel', 'costPrice', 'sellingPrice', 'status', 'category', 'lastRestocked'];

export async function getInventory(): Promise<InventoryItem[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${INVENTORY_SHEET_NAME}!A2:J`,
    });

    const rows = response.data.values;
    if (!rows) return [];
    
    return rows.map(row => ({
      id: row[0],
      productName: row[1],
      currentStock: parseInt(row[2], 10),
      unit: row[3],
      reorderLevel: parseInt(row[4], 10),
      costPrice: parseFloat(row[5]),
      sellingPrice: parseFloat(row[6]),
      status: row[7] as 'ok' | 'low' | 'overstock',
      category: row[8],
      lastRestocked: row[9],
    }));
  } catch (error) {
    console.error('Error fetching inventory from Google Sheets:', error);
    throw new Error('Failed to fetch inventory data.');
  }
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status'>): Promise<InventoryItem> {
  try {
    const newId = `p${Date.now()}`;
    const status = parseInt(String(item.currentStock), 10) < parseInt(String(item.reorderLevel), 10) ? 'low' : 'ok';
    const newItem: InventoryItem = { ...item, id: newId, status };

    const newRow = INVENTORY_HEADERS.map(header => newItem[header as keyof InventoryItem]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${INVENTORY_SHEET_NAME}!A:J`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [newRow],
      },
    });
    return newItem;
  } catch (error) {
    console.error('Error adding inventory item to Google Sheets:', error);
    throw new Error('Failed to add inventory item.');
  }
}

export async function updateInventoryItem(item: InventoryItem): Promise<InventoryItem> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${INVENTORY_SHEET_NAME}!A2:A`,
        });

        const idColumn = response.data.values;
        if (!idColumn) {
            throw new Error('Could not find item to update.');
        }

        const rowIndex = idColumn.findIndex(row => row[0] === item.id) + 2; // +2 for 1-based index and header
        if (rowIndex < 2) {
            throw new Error('Could not find item to update.');
        }
        
        const status = item.currentStock < item.reorderLevel ? 'low' : 'ok';
        const updatedItem = { ...item, status };
        
        const newRow = INVENTORY_HEADERS.map(header => updatedItem[header as keyof InventoryItem]);

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${INVENTORY_SHEET_NAME}!A${rowIndex}:J${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [newRow],
            },
        });
        return updatedItem;
    } catch (error) {
        console.error('Error updating inventory item in Google Sheets:', error);
        throw new Error('Failed to update inventory item.');
    }
}


export async function deleteInventoryItem(id: string): Promise<void> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${INVENTORY_SHEET_NAME}!A2:A`,
        });

        const idColumn = response.data.values;
        if (!idColumn) {
            throw new Error('Could not find item to delete.');
        }

        const rowIndex = idColumn.findIndex(row => row[0] === id) + 2;
        if (rowIndex < 2) {
            throw new Error('Could not find item to delete.');
        }

        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: `${INVENTORY_SHEET_NAME}!A${rowIndex}:J${rowIndex}`,
        });
    } catch (error) {
        console.error('Error deleting inventory item from Google Sheets:', error);
        throw new Error('Failed to delete inventory item.');
    }
}


// CUSTOMER FUNCTIONS
const CUSTOMER_SHEET_NAME = 'Customers';

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CUSTOMER_SHEET_NAME}!A2:J`,
    });

    const rows = response.data.values;
    if (!rows) return [];

    return rows.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      firstPurchase: row[3],
      lastPurchase: row[4],
      totalPurchases: parseInt(row[5], 10) || 0,
      totalSpent: parseFloat(row[6]) || 0,
      averageOrderValue: parseFloat(row[7]) || 0,
      segment: (row[9] as Customer['segment']) || undefined,
    }));
  } catch (error) {
    console.error('Error fetching customers from Google Sheets:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

// SALES FUNCTIONS
const SALES_SHEET_NAME = 'Sales';

export async function getSales(): Promise<SalesRecord[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SALES_SHEET_NAME}!A2:J`,
    });

    const rows = response.data.values;
    if (!rows) return [];
    
    return rows.map(row => ({
      id: row[0],
      date: row[1],
      productName: row[2],
      productId: row[3],
      quantity: parseInt(row[4], 10),
      unitPrice: parseFloat(row[5]),
      totalAmount: parseFloat(row[6]),
      customerName: row[7],
      customerId: row[8],
      paymentStatus: row[9] as 'paid' | 'pending' | 'partial',
    }));
  } catch (error) {
    console.error('Error fetching sales from Google Sheets:', error);
    throw new Error('Failed to fetch sales data.');
  }
}


// CREDENTIALS FUNCTIONS
const CREDENTIALS_SHEET_NAME = 'credentials';

export async function getCredentials(): Promise<UserCredentials[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CREDENTIALS_SHEET_NAME}!A2:B`,
    });
    const rows = response.data.values;
    if (!rows) return [];
    return rows.map(row => ({
      email: row[0],
      password: row[1],
    }));
  } catch (error) {
    console.error('Error fetching credentials from Google Sheets:', error);
    throw new Error('Failed to fetch user credentials.');
  }
}

export async function addUser(user: UserCredentials): Promise<void> {
    try {
        const existingUsers = await getCredentials();
        if (existingUsers.some(u => u.email === user.email)) {
            throw new Error('User with this email already exists.');
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${CREDENTIALS_SHEET_NAME}!A:B`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[user.email, user.password]],
            },
        });
    } catch (error: any) {
        console.error('Error adding user to Google Sheets:', error);
        throw new Error(error.message || 'Failed to add user.');
    }
}

export async function updatePassword(email: string, newPassword: string): Promise<void> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${CREDENTIALS_SHEET_NAME}!A2:A`,
        });

        const emailColumn = response.data.values;
        if (!emailColumn) {
            throw new Error('Could not find user to update.');
        }

        const rowIndex = emailColumn.findIndex(row => row[0] === email) + 2;
        if (rowIndex < 2) {
            throw new Error('User not found.');
        }

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${CREDENTIALS_SHEET_NAME}!B${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[newPassword]],
            },
        });
    } catch (error: any) {
        console.error('Error updating password in Google Sheets:', error);
        throw new Error(error.message || 'Failed to update password.');
    }
}
