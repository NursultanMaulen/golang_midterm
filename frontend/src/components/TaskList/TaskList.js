import React, { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../../api";
import { Button, Input, Table, Typography, Popconfirm } from "antd";
import { NavLink as Link } from "react-router-dom";

const { Title, Text } = Typography;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    is_complete: false,
    userid: 1,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksData = await getTasks();
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    const createdTask = await createTask(newTask);
    setTasks([...tasks, createdTask]);
    setNewTask({
      title: "",
      description: "",
      is_complete: false,
      userid: 1,
    });
  };

  const handleDeleteTask = async (ID) => {
    console.log("DELETING ID: ", ID);
    await deleteTask(ID);
    setTasks(tasks.filter((task) => task.ID !== ID));
  };

  const toggleComplete = async (task) => {
    const updatedTask = { ...task, is_complete: !task.is_complete };

    try {
      const response = await fetch(`http://localhost:8080/tasks/${task.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Error updating task");
      }

      const data = await response.json();
      setTasks(tasks.map((t) => (t.ID === data.ID ? data : t))); // Обновляем состояние задач
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "is_complete",
      key: "is_complete",
      render: (text, record) => (
        <Text style={{ color: record.is_complete ? "green" : "red" }}>
          {record.is_complete ? "Completed" : "Not Completed"}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type={record.is_complete ? "default" : "primary"}
            onClick={() => toggleComplete(record)}
          >
            {record.is_complete ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
          <Button
            onClick={() => handleDeleteTask(record.ID)}
            type="danger"
            style={{ marginLeft: "10px" }}
          >
            Delete
          </Button>
          <Link to={`/task/${record.ID}`}>
            <Button type="default" style={{ marginLeft: "10px" }}>
              Select
            </Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <Title level={3}>Add New Task</Title>
      <Input
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Description"
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        style={{ marginBottom: "10px" }}
      />
      <Button
        type="primary"
        onClick={handleCreateTask}
        style={{ marginBottom: "20px" }}
      >
        Add Task
      </Button>

      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="ID"
        pagination={false}
      />
    </div>
  );
};

export default TaskList;
