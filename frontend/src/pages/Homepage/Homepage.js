import React from "react";
import TaskList from "../../components/TaskList/TaskList";
import { Button, Typography, Layout } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Home = ({ tasks, onEdit, onDelete }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", color: "#fff" }}>
        <Title style={{ color: "#fff", margin: "10px" }} level={2}>
          Task Manager
        </Title>
      </Header>
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TaskList />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <p style={{ margin: 0 }}>
          © 2024 Task Manager by NURS. All rights reserved.
        </p>
      </Footer>
    </Layout>
  );
};

export default Home;
