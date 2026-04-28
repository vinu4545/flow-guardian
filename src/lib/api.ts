// API service for backend communication
const API_BASE = 'http://localhost:5000/api';

export interface Alert {
  id: number;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface DetectionResult {
  message: string;
  cycles_found?: number;
  cycles?: string[][];
  count?: number;
  paths?: string[][];
}

export const apiService = {
  // Fetch all alerts
  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE}/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    return response.json();
  },

  // Run circular detection
  async detectCircular(): Promise<DetectionResult> {
    const response = await fetch(`${API_BASE}/detection/circular`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to run circular detection');
    }
    return response.json();
  },

  // Run layering detection
  async detectLayering(): Promise<DetectionResult> {
    const response = await fetch(`${API_BASE}/detection/layering`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to run layering detection');
    }
    return response.json();
  },
};

export const getSuspiciousGraph = async () => {
  const res = await fetch(`${API_BASE}/graph/suspicious`);
  if (!res.ok) throw new Error('Failed to fetch suspicious graph');
  return res.json();
};