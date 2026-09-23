import { Canvas, CanvasElement } from '../types/element';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await res.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function createCanvas(
  name: string,
  elements: CanvasElement[]
): Promise<Canvas> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, elements }),
  });
  return handleResponse<Canvas>(res);
}

export async function listCanvases(): Promise<Canvas[]> {
  const res = await fetch(API_BASE_URL);
  return handleResponse<Canvas[]>(res);
}

export async function getCanvas(id: string): Promise<Canvas> {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse<Canvas>(res);
}

export async function updateCanvas(
  id: string,
  updates: { name?: string; elements?: CanvasElement[] }
): Promise<Canvas> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Canvas>(res);
}

export async function deleteCanvas(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(res);
}
