import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, Typography } from "antd";

const { Title } = Typography;

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    is_complete: false,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTask(data);
        setUpdatedTask({
          title: data.title,
          description: data.description,
          is_complete: data.is_complete,
        });
      })
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  const toggleComplete = () => {
    const newCompleteStatus = !task.is_complete;
    const updatedTask = { ...task, is_complete: newCompleteStatus };

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating task");
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  const handleSave = () => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating task");
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
        setEditing(false);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <Title level={2}>Task Details</Title>
      <p>
        <strong>ID:</strong> {task.ID}
      </p>
      {editing ? (
        <>
          <Input
            name="title"
            value={updatedTask.title}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <Input
            name="description"
            value={updatedTask.description}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <Button
            type="primary"
            onClick={handleSave}
            style={{ marginBottom: "10px" }}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <p>
            <strong>Title:</strong> {task.title}
          </p>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
        </>
      )}
      <p>
        <strong>Is Complete:</strong> {task.is_complete ? "Yes" : "No"}
      </p>
      <Button onClick={toggleComplete}>
        Mark as {task.is_complete ? "Incomplete" : "Complete"}
      </Button>
      <Button
        type="default"
        onClick={handleEditClick}
        style={{ margin: "10px" }}
      >
        Edit
      </Button>
    </div>
  );
};

export default TaskDetail;
