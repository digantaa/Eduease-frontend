import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7013/hubs/notifications", {
    withCredentials: true,
  }) // Update with your API URL
  .withAutomaticReconnect()
  .build();

const startConnection = async () => {
  try {
    await connection.start();
    connection.send("updateNotificationCount"); // Call server method
    console.log("✅ SignalR Connected");
  } catch (err) {
    console.error("❌ SignalR Connection Failed: ", err);
    setTimeout(startConnection, 5000); // Retry connection after 5 seconds
  }
};

// Export connection
export { connection, startConnection };
