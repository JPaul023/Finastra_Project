import React, { useState, useEffect } from "react";

const CustomerSupport = () => {
  const [tickets, setTickets] = useState(() => {
    return JSON.parse(localStorage.getItem("tickets")) || [];
  });
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "Low" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  // Function to create a ticket with a proper ID format
  const handleCreateTicket = (e) => {
    e.preventDefault();

    if (!newTicket.subject || !newTicket.description) {
      alert("Please enter a subject and description.");
      return;
    }

    if (window.confirm("Are you sure you want to create this ticket?")) {
      let lastTicket = tickets.length > 0 
        ? Math.max(...tickets.map(ticket => parseInt(ticket.id.replace("CS-", ""), 10))) 
        : 24000;

      let newID = `CS-${lastTicket + 1}`;

      const newEntry = { 
        id: newID, 
        ...newTicket, 
        status: "Open", 
        createdAt: new Date().toLocaleString()
      };

      setTickets([...tickets, newEntry]);
      setNewTicket({ subject: "", description: "", priority: "Low" });
    }
  };

  // Function to change ticket status
  const handleStatusChange = (id, newStatus) => {
    setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, status: newStatus } : ticket));
  };

  // Function to delete a ticket with confirmation
  const handleDeleteTicket = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setTickets(tickets.filter(ticket => ticket.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>Customer Ticketing Support</h2>

      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px", width: "30%" }}
      />

      <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "16px", boxShadow: "0px 0px 8px rgba(0,0,0,0.1)", textAlign: "left" }}>
        <form onSubmit={handleCreateTicket} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Subject"
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "100px" }}
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            required
          />
          <select 
            value={newTicket.priority} 
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <button type="submit" style={{ background: "#007bff", color: "white", padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>Create Ticket</button>
        </form>
      </div>

      <select onChange={(e) => setFilter(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px", width: "15%" }}>
        <option value="All">All</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #333", backgroundColor: "#f9f9f9", textAlign: "center" }}>
        <thead style={{ backgroundColor: "#ddd", fontWeight: "bold", textAlign: "center" }}>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #333" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #333" }}>Subject</th>
            <th style={{ padding: "10px", border: "1px solid #333" }}>Priority</th>
            <th style={{ padding: "10px", border: "1px solid #333" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #333" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets
            .filter(ticket => (filter === "All" || ticket.status === filter) && ticket.subject.toLowerCase().includes(search.toLowerCase()))
            .map(ticket => (
              <tr key={ticket.id}>
                <td style={{ padding: "10px", border: "1px solid #333" }}>{ticket.id}</td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>{ticket.subject}</td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>{ticket.priority}</td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  <select value={ticket.status} onChange={(e) => handleStatusChange(ticket.id, e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td style={{ padding: "10px", border: "1px solid #333" }}>
                  <span onClick={() => setSelectedTicket(ticket)} style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline", margin: "5px" }}>View</span>
                  <span onClick={() => handleDeleteTicket(ticket.id)} style={{ color: "red", cursor: "pointer", textDecoration: "underline", margin: "5px" }}>Delete</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedTicket && (
        <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginTop: "16px", boxShadow: "0px 0px 8px rgba(0,0,0,0.1)", textAlign: "left" }}>
          <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>Ticket Details</h3>
          <p><strong>Subject:</strong> {selectedTicket.subject}</p>
          <p><strong>Description:</strong> {selectedTicket.description}</p>
          <p><strong>Priority:</strong> {selectedTicket.priority}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>
          <p><strong>Created At:</strong> {selectedTicket.createdAt}</p>
          <button onClick={() => setSelectedTicket(null)} style={{ background: "#dc3545", color: "white", padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
