export async function fetchNui<T = any>(eventName: string, data?: any, mockData?: T): Promise<T> {
  if (import.meta.env.DEV && !(window as any).GetParentResourceName) {
    if (mockData !== undefined) return mockData;
  }

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'mdt_police';

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data),
    });

    return await resp.json();
  } catch (err) {
    console.warn(`[NUI Error] Event '${eventName}' failed:`, err);
    return mockData as T;
  }
}