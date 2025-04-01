import React, { useState, useEffect } from "react";

const EmailSmsAutomation = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [type, setType] = useState("email");

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("logs")) || [];
    setLogs(storedLogs);
  }, []);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const handleSend = () => {
    if (!recipients || !message) {
      alert("Please enter recipients and message.");
      return;
    }

    const newLog = {
      id: logs.length + 1,
      type,
      recipients,
      subject,
      message,
      timestamp: new Date().toLocaleString(),
    };

    setLogs([newLog, ...logs]);
    setRecipients("");
    setSubject("");
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Email & SMS Automation</h2>

      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
        <select
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <input
          type="text"
          placeholder="Recipients (comma-separated)"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        {type === "email" && (
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        )}
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "8px", minHeight: "100px", marginBottom: "10px" }}
        />
        <button
          onClick={handleSend}
          style={{ width: "100%", padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
        >
          Send {type === "email" ? "Email" : "SMS"}
        </button>
      </div>

      <h3>Logs</h3>
      <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", background: "#f9f9f9" }}>
        {logs.length === 0 ? (
          <p style={{ color: "#777" }}>No messages sent yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: "0" }}>
            {logs.map((log) => (
              <li key={log.id} style={{ padding: "5px 0", borderBottom: "1px solid #ddd" }}>
                <strong>{log.type.toUpperCase()}:</strong> {log.recipients} - {log.subject && `Subject: ${log.subject}`} {log.message} ({log.timestamp})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailSmsAutomation;
