const simulateNotification = ({
  event,
  recipientName,
  recipientEmail,
  taskTitle,
  sender = "System",
}) => {
  console.log(`

SIMULATED ASSIGNMENT NOTIFICATION:
Event      : ${event}
Recipient  : ${recipientName}
Email      : ${recipientEmail}
Task       : ${taskTitle}
Sender     : ${sender}
Time       : ${new Date().toLocaleString()}

`);
};

module.exports = simulateNotification;