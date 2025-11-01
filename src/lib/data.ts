import { SalesRecord, InventoryItem, Customer } from "@/types";
import { PlaceHolderImages } from "./placeholder-images";

const avatar1 = PlaceHolderImages.find(p => p.id === "avatar-1")?.imageUrl || "";
const avatar2 = PlaceHolderImages.find(p => p.id === "avatar-2")?.imageUrl || "";
const avatar3 = PlaceHolderImages.find(p => p.id === "avatar-3")?.imageUrl || "";
const avatar4 = PlaceHolderImages.find(p => p.id === "avatar-4")?.imageUrl || "";
const avatar5 = PlaceHolderImages.find(p => p.id === "avatar-5")?.imageUrl || "";


export const mockSales: SalesRecord[] = [
    {
        id: "1",
        date: "2024-07-22T10:30:00Z",
        productName: "Premium Wireless Mouse",
        quantity: 2,
        unitPrice: 2500,
        totalAmount: 5000,
        customerName: "Rahim Islam",
        paymentStatus: 'paid',
        customerAvatarUrl: avatar1,
    },
    {
        id: "2",
        date: "2024-07-22T11:00:00Z",
        productName: "Mechanical Keyboard",
        quantity: 1,
        unitPrice: 8000,
        totalAmount: 8000,
        customerName: "Fatima Ahmed",
        paymentStatus: 'paid',
        customerAvatarUrl: avatar2,
    },
    {
        id: "3",
        date: "2024-07-21T15:00:00Z",
        productName: "USB-C Hub",
        quantity: 5,
        unitPrice: 1500,
        totalAmount: 7500,
        customerName: "Karim Chowdhury",
        paymentStatus: 'pending',
        customerAvatarUrl: avatar3,
    },
    {
        id: "4",
        date: "2024-07-21T09:00:00Z",
        productName: "4K Webcam",
        quantity: 1,
        unitPrice: 6500,
        totalAmount: 6500,
        customerName: "Ayesha Khan",
        paymentStatus: 'paid',
        customerAvatarUrl: avatar4,
    },
    {
        id: "5",
        date: "2024-07-20T18:00:00Z",
        productName: "Laptop Stand",
        quantity: 3,
        unitPrice: 2200,
        totalAmount: 6600,
        customerName: "Jamil Hasan",
        paymentStatus: 'partial',
        customerAvatarUrl: avatar5,
    },
];

export const mockInventory: InventoryItem[] = [
    {
        id: "p1",
        productName: "Premium Wireless Mouse",
        currentStock: 15,
        unit: "pcs",
        reorderLevel: 10,
        status: 'ok',
    },
    {
        id: "p2",
        productName: "Mechanical Keyboard",
        currentStock: 5,
        unit: "pcs",
        reorderLevel: 8,
        status: 'low',
    },
    {
        id: "p3",
        productName: "USB-C Hub",
        currentStock: 50,
        unit: "pcs",
        reorderLevel: 20,
        status: 'ok',
    },
    {
        id: "p4",
        productName: "4K Webcam",
        currentStock: 8,
        unit: "pcs",
        reorderLevel: 5,
        status: 'ok',
    },
    {
        id: "p5",
        productName: "Ergonomic Chair",
        currentStock: 30,
        unit: "pcs",
        reorderLevel: 15,
        status: 'overstock',
    }
];
