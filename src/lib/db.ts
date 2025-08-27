// This is a simple in-memory store.
// In a real application, you would use a persistent database like Firestore, PostgreSQL, etc.
export const submissions: { id: string; timestamp: Date; answers: number[] }[] = [];
