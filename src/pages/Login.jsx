import React, { useContext, useEffect, useState } from 'react';
import { loginApi } from '../services/apiService'; 
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd'; // Import thêm message
import { useNavigate } from 'react-router-dom';
import Logo from '../components/logo/Logo';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginContext } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0); 

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    setLoadingApi(true);
    let res = await loginApi(values.email, values.password);

    if (res && res.data) {

      loginContext(email, res.data);
      navigate("/");
    } else {
      
      setFailedAttempts((prev) => prev + 1);
      message.error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!"); 
    }

    setLoadingApi(false);
  };

  return (
    <>
      <div className="header">
        <div className="logo ">
          <Logo />
        </div>
      </div>
      <div className="login">
        <Form
          className="formLogin"
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <div className="title">
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập tài khoản</p>
          </div>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <div className="forgot">
              {failedAttempts >= 3 ? (
                <a href="/forgot-password">Quên mật khẩu?</a>
              ) : (
                <a href="" style={{ display: "none" }}></a>
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" disabled={loadingApi}>
              {loadingApi && <i className="fas fa-spinner fa-pulse"></i>}
              &nbsp; Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
