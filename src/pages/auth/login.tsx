import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import styles from "@/styles/auth/login.module.css"
import { useLoginUserMutation } from '@/store/api/auth/loginApi';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/actions/auth';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Head from 'next/head';
import Link from 'next/link';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Login: React.FC = () => {
    
const [ loginUser, { isLoading}] = useLoginUserMutation();
const [api, contextHolder] = notification.useNotification();
const dispatch = useDispatch();
const router = useRouter()
const [cookies, setCookie] = useCookies(["todo-token"]);
    const openNotificationWithIcon = (type: NotificationType, message: any) => {
      api[type]({
        message: type == "error" ? "Unsuccessfully" : "Successfully",
        description: message,
      });
    };

  const onFinish = async (values: any) => {
    try {
        const response : any = await loginUser(values);
        // Access the response data
        console.log(response);
        if (response?.error?.data?.status == 'fail') {
            openNotificationWithIcon("error", response?.error?.data?.message)
        } else {
            openNotificationWithIcon("success", "");
            dispatch(setToken(response?.data?.token));
            setCookie("todo-token", response?.data?.token , {
            path: "/",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 day
            });
            router.push("/")
        }
      } catch (error:any) {
        // Handle the error
        console.log(error);
      }
  };

  return (
    <>
    {contextHolder}
    <Head>
        <title>Todo App / Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.login}>
        <div className={styles.loginBody}>
            <h1 className={styles.title}>Login</h1>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
                >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button 
                     type="primary" htmlType="submit" loading={isLoading} className={styles.full_w_btn} >
                        Log in
                    </Button>
                </Form.Item>
                <div className={styles.registerHref}>
                    <Link  href="/auth/register">register now!</Link>
                </div>
            </Form>
        </div>
    </div>
    </>

  );
};

export default Login;
