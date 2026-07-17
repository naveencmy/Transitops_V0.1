ort const API_BASE_URL = '/api';export const API_DELAY = 350;

export async function mockRequest<T>(data: T, shouldFail = false): Promise<T> {return new Promise((resolve, reject) => {setTimeout(() => {if (shouldFail) {reject(new Error('Request failed (mock)'));return;}resolve(data);}, API_DELAY);});}

export function formatDate(iso: string): string {return new Date(iso).toLocaleDateString('en-US', {year: 'numeric',month: 'short',day: 'numeric',});}

export function formatCurrency(value: number): string {return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'INR',maximumFractionDigits: 0,}).format(value);}

export function formatNumber(value: number): string {return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);}

