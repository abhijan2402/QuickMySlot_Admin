// Function to format a date into "DD MMM YYYY, HH:mm" format, safely handling null/undefined
export function formatDate(dateInput: string) {
  if (!dateInput) return "Invalid date";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: false,
  });
}

// Function to get status text from status value, safely handling null/undefined
export function getStatusTextAndColor(statusValue: string) {
  if (!statusValue || typeof statusValue !== "string")
    return { text: "Unknown", color: "default" };
  const statusMap: Record<string, { text: string; color: string }> = {
    open: { text: "Open", color: "green" },
    pending: { text: "Pending", color: "orange" },
    closed: { text: "Closed", color: "red" },
  };
  return (
    statusMap[statusValue.toLowerCase()] || {
      text: "Unknown",
      color: "default",
    }
  );
}
