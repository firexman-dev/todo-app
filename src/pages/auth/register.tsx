import React from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import styles from "@/styles/auth/login.module.css"
import Head from 'next/head';
import { useCreateUserMutation } from '@/store/api/auth/registerApi';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/actions/auth';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Link from 'next/link';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Register: React.FC = () => {
    const [ createUser, { isLoading}] = useCreateUserMutation();
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
        const response : any = await createUser(values);
        // Access the result data
        console.log(response)
        if (response?.error?.data?.status == 'fail') {
            openNotificationWithIcon("error", response?.error?.data?.message)
        } else if (response?.error?.data?.status == 'confilct'){
          openNotificationWithIcon("error", "Conflict")
        }
        else {
            openNotificationWithIcon("success", "");
            dispatch(setToken(response?.data?.token));
            setCookie("todo-token", response?.data?.token , {
              path: "/",
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 day
              });
            router.push("/")
        }
      } catch (error) {
        // Handle the error
        console.log(error);
      }
  };
  return (
    <>
    {contextHolder}
      <Head>
            <title>Todo App / Register</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.login}>
        <div className={styles.loginBody}>
            <h1 className={styles.title}>Register</h1>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input 
                    name='email'
                    placeholder="Email"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    />
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
                        Register
                    </Button>
                </Form.Item>
                <div className={styles.registerHref}>
                   <Link href="/auth/login"> login</Link>
                </div>
            </Form>
        </div>
    </div>
    </>
    
    

  );
};

export default Register;
