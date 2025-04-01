import React, { useEffect, useState } from "react";


const CustomerTable = () => {
    const [clients, setClients] = useState(() => {
        // Retrieve stored clients from localStorage or default to an empty array
        return JSON.parse(localStorage.getItem("clients")) || [];
    });
    
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [newClient, setNewClient] = useState({
        client_id: "",
        name: "",
        company: "",
        contact_number: "",
        emails: "",
        status: "Prospect",
        num_interactions: 0 // New field added
    });
    
    // Update localStorage whenever clients change
    useEffect(() => {
        localStorage.setItem("clients", JSON.stringify(clients));
    }, [clients]);
    

    const generateClientID = () => {
        if (clients.length === 0) {
            return "24001";
        }

        const lastClient = clients.reduce((prev, current) =>
            parseInt(prev.client_id.slice(2)) > parseInt(current.client_id.slice(2)) ? prev : current
        );

        const lastNumber = parseInt(lastClient.client_id.slice(2));
        const newNumber = lastNumber + 1;

        return `24${newNumber.toString().padStart(3, "0")}`;
    };

    const handleAddClientClick = () => {
        setIsEditing(true);
        setNewClient({
            client_id: generateClientID(),
            name: "",
            company: "",
            contact_number: "",
            emails: "",
            status: "Prospect"
        });
        setShowViewModal(true);
    };

    const handleClearClients = () => {
        const confirmDelete = window.confirm("Are you sure you want to clear all client data?");
        if (confirmDelete) {
            setClients([]); // Reset state to an empty array
            localStorage.removeItem("clients"); // Clear from localStorage
        }
    };

    const handleClientClick = (client, event, editMode = false) => {
        event.preventDefault();
    
        // Increment interactions count
        const updatedClients = clients.map(c => 
            c.client_id === client.client_id ? { ...c, num_interactions: (c.num_interactions || 0) + 1 } : c
        );
    
        // Update state and localStorage with new client list
        setClients(updatedClients);
        localStorage.setItem("clients", JSON.stringify(updatedClients));
    
        // Set the client details for modal (fetch updated client directly)
        setIsEditing(editMode);
        setNewClient(prevClient => ({
            ...updatedClients.find(c => c.client_id === client.client_id),
            emails: updatedClients.find(c => c.client_id === client.client_id).emails.map(email => email.email).join(", ")
        }));
    
        setShowViewModal(true);
    };

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleSaveClient = () => {
        if (!newClient.name || !newClient.company || !newClient.contact_number || !newClient.emails) {
            alert("Please fill in all fields.");
            return;
        }
    
        const confirmSave = window.confirm("Are you sure you want to save this client?");
        if (!confirmSave) {
            return; // Stop if the user cancels
        }
    
        const formattedClient = {
            ...newClient,
            emails: newClient.emails.split(",").map(email => ({ email: email.trim() })),
            num_interactions: parseInt(newClient.num_interactions) || 0 // Ensure it's a number
        };
    
        setClients(prevClients => {
            const clientExists = prevClients.find(client => client.client_id === newClient.client_id);
            if (clientExists) {
                return prevClients.map(client => (client.client_id === newClient.client_id ? formattedClient : client));
            } else {
                return [...prevClients, formattedClient];
            }
        });
    
        setShowViewModal(false);
    };

    const clientCounts = {
        Prospect: clients.filter(client => client.status === "Prospect").length,
        New: clients.filter(client => client.status === "New").length,
        Regular: clients.filter(client => client.status === "Regular").length,
        Key: clients.filter(client => client.status === "Key").length
    };

    return (
        <div style={{ padding: "20px", maxWidth: "80%", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "50px", color: "#333" }}>Client Database & Interaction Tracking</h1>

            {/* CRM Dashboard */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                {["Prospect", "New", "Regular", "Key"].map((status, index) => (
                    <div key={index} style={{
                        flex: 1,
                        padding: "15px",
                        textAlign: "center",
                        backgroundColor: status === "Prospect" ? "#007bff" :
                            status === "New" ? "#28a745" :
                                status === "Regular" ? "#ffc107" : "#dc3545",
                        color: "white",
                        fontSize: "18px",
                        borderRadius: "10px",
                        margin: "0 10px"
                    }}>
                        <strong>{status} Clients</strong>
                        <div style={{ fontSize: "24px", marginTop: "5px" }}>{clientCounts[status]}</div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <button
                    style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "16px", borderRadius: "5px" }}
                    onClick={handleAddClientClick}
                >
                    Add Client
                </button>

                <button 
                    style={{ padding: "10px 15px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", fontSize: "16px", borderRadius: "5px", marginLeft: "10px" }} 
                     onClick={handleClearClients}
    >
                    Clear Table
                 </button>   
            </div>

            {showViewModal && (
                <div style={{
                    position: "fixed",
                    top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    zIndex: 1000
                }}>

                    
                    
                    <h3>{isEditing ? "Modify Client" : "Client Details"}</h3>

                    <label>Client ID:</label>
                    <input type="text" value={newClient.client_id} readOnly style={{ width: "100%", backgroundColor: "#eee" }} />

                    <label>Name:</label>
                    <input type="text" name="name" value={newClient.name} onChange={handleInputChange} readOnly={!isEditing} style={{ width: "100%" }} />

                    <label>Company:</label>
                    <input type="text" name="company" value={newClient.company} onChange={handleInputChange} readOnly={!isEditing} style={{ width: "100%" }} />

                    <label>Contact Number:</label>
                    <input type="text" name="contact_number" value={newClient.contact_number} onChange={handleInputChange} readOnly={!isEditing} style={{ width: "100%" }} />

                    <label>Emails:</label>
                    <input type="text" name="emails" value={newClient.emails} onChange={handleInputChange} readOnly={!isEditing} style={{ width: "100%" }} />

                    <label>Status:</label>
                    <select name="status" value={newClient.status} onChange={handleInputChange} disabled={!isEditing} style={{ width: "100%" }}>
                        <option value="Prospect">Prospect</option>
                        <option value="New">New</option>
                        <option value="Regular">Regular</option>
                        <option value="Key">Key</option>
                    </select>

                    <label>Number of Interactions:</label>
                    <input 
                        type="number" 
                        name="num_interactions" 
                        value={newClient.num_interactions} readOnly style={{ width: "100%", backgroundColor: "#eee" }}
                        onChange={handleInputChange}  
                    />

                    {/* Add Interaction Button */}
                    <button onClick={''} style={{ margin: "10px 5px", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
                            Add New Interaction
                    </button>

                    {isEditing && (
                        <button onClick={handleSaveClient} style={{ margin: "5px", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px" }}>
                            Save
                        </button>
                    )}

                    <button onClick={() => setShowViewModal(false)} style={{ margin: "5px", padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>
                        Close
                    </button>
                </div>
            )}

<table style={{ width: "100%", borderCollapse: "collapse",  border: "2px solid #333", backgroundColor: "#f9f9f9" 
}}>
    <thead style={{ backgroundColor: "#ddd", fontWeight: "bold", textAlign: "center" }}>
        <tr>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Client ID</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Client Name</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Client Company</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Contact Number</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Client Email(s)</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Status</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #333" }}>Action</th>
        </tr>
    </thead>
    <tbody>
        {clients.map(client => (
            <tr key={client.client_id}>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>
                    <button style={{ 
                        color: "#007bff", 
                        background: "none", 
                        border: "none", 
                        textDecoration: "underline", 
                        cursor: "pointer" 
                    }} onClick={(event) => handleClientClick(client, event)}>
                        {client.client_id}
                    </button>
                </td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>{client.name}</td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>{client.company}</td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>{client.contact_number}</td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>{client.emails.map(email => email.email).join(", ")}</td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>{client.status}</td>
                <td style={{ textAlign: "center", padding: "10px", border: "1px solid #333" }}>
                    <button onClick={(event) => handleClientClick(client, event, true)}>Modify</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
        </div>
    );
};

export default CustomerTable;
