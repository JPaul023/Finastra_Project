import React, { useEffect, useState } from "react";
import hrAPI from "../../services/hrapi";
import { Container, Table, Button, Spinner } from "react-bootstrap";

const Performance = () => {
    const [unevaluated, setUnevaluated] = useState([]);
    const [evaluated, setEvaluated] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const unevaluatedRes = await hrAPI.getUnevaluatedEmployees();
            const evaluatedRes = await hrAPI.getEvaluatedEmployees();
            setUnevaluated(unevaluatedRes.data);
            setEvaluated(evaluatedRes.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
        setLoading(false);
    };

    const handleEvaluate = async (id) => {
        const score = prompt("Enter Performance Score (1-100):");
        if (score) {
            try {
                await hrAPI.evaluateEmployee(id, parseInt(score));
                fetchEmployees();
            } catch (error) {
                console.error("Error evaluating employee:", error);
            }
        }
    };

    const handleEdit = async (id, currentScore) => {
        const newScore = prompt("Enter New Performance Score:", currentScore);
        if (newScore) {
            try {
                await hrAPI.editPerformance(id, parseInt(newScore));
                fetchEmployees();
            } catch (error) {
                console.error("Error updating performance score:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to reset this employee's evaluation?")) {
            try {
                await hrAPI.resetEvaluation(id);
                fetchEmployees();
            } catch (error) {
                console.error("Error resetting evaluation:", error);
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Performance Evaluation</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <h4 className="mt-3">Unevaluated Employees</h4>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unevaluated.length > 0 ? (
                                unevaluated.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.first_name} {emp.last_name}</td>
                                        <td>{emp.position}</td>
                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => handleEvaluate(emp.id)}>
                                                Evaluate
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No unevaluated employees.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <h4 className="mt-4">Evaluated Employees</h4>
                    <Table striped bordered hover responsive>
                        <thead className="table-success">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluated.length > 0 ? (
                                evaluated.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.first_name} {emp.last_name}</td>
                                        <td>{emp.position}</td>
                                        <td>{emp.performance_score}</td>
                                        <td>
                                            <Button variant="warning" size="sm" className="me-2"
                                                onClick={() => handleEdit(emp.id, emp.performance_score)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm"
                                                onClick={() => handleDelete(emp.id)}>
                                                Reset
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No evaluated employees yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default Performance;
