// Basic in-memory store for audit logs
// In a real app, this would be a database or a server-side state

export type AuditEntry = {
  id: string;
  user: string;
  action: string; // SQL type: INSERT, UPDATE, DELETE
  details: string; // SQL query or description
  timestamp: string;
  host: string;
};

let auditLogs: AuditEntry[] = [];

export const getAuditLogs = () => [...auditLogs].reverse();

export const addAuditLog = (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'host'>) => {
  const newEntry: AuditEntry = {
    ...entry,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleString(),
    host: typeof window !== 'undefined' ? window.location.hostname : 'Server-Side'
  };
  auditLogs.push(newEntry);

  // Trigger a custom event to notify components if needed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('audit-update'));
  }
};

// Initial logs for demo
if (auditLogs.length === 0) {
  addAuditLog({ user: 'System', action: 'INIT', details: 'Database connection established' });
}
