import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import styles from "./list.module.css"
import { useCreateListMutation, useUpdateListMutation } from '@/store/api/lists/listApi';
import { useCookies } from 'react-cookie';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const FormList = ({state, setState}: any) => {
    const [ createList, { isLoading }] = useCreateListMutation();
    const [ updateList ] = useUpdateListMutation();
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const [cookies] = useCookies(['todo-token']);
    var token = cookies["todo-token"];
    const openNotificationWithIcon = (type: NotificationType, message: any) => {
        api[type]({
          message: type == "error" ? "Unsuccessfully" : "Successfully",
          description: message,
        });
      };
  const handleOk = () => {
    setState({ type: "SET_MODAL", payload: false});

  };
  const handleCancel = () => {
    setState({ type: "SET_MODAL", payload: false});
  };

  useEffect(() => {
    if (state.status_form == "edit") {
        form.setFieldsValue({ ["name"]: state.update_item?.name });
    } else {
      form.resetFields();
    }
  }, [state.update_item?.uuid]);
  
  const onFinish = async (values: any) => {
    setState({ type: "SET_LOADING_BTN", payload: true});
    const update_id = state.update_item?.uuid;
    try {
        if (state.status_form === "create"){
            const response : any = await createList({values, token });
            // Access the response data
            setState({ type: "ADD_ELEMENT", payload: response.data});
            setState({ type: "SET_MODAL", payload: false});
            setState({ type: "SET_LOADING_BTN", payload: false});
            openNotificationWithIcon("success", "added item");
            form.resetFields();
        } else {
            const response : any = await updateList({values, token, update_id });
            // Access the response data
            if (response.data.status == "success"){
                values = {...values, uuid: update_id};
                setState({ type: "UPDATE_ELEMENT", payload: values});
                setState({ type: "SET_MODAL", payload: false});
                setState({ type: "SET_LOADING_BTN", payload: false});
                openNotificationWithIcon("success", "updated item!");
                form.resetFields();
            } else {
                openNotificationWithIcon("error", "");
            }
            
        }
        } catch (error:any) {
        // Handle the error
        console.log(error);
      }
  }

  return (
    <>
    {contextHolder}
      <Modal title="List" footer={null} open={state.modal} onOk={handleOk} onCancel={handleCancel}>
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
            >
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Name is required!' }]}
            >
                <Input placeholder="Name" className={styles.input} />
            </Form.Item>
            <Form.Item className={styles.item_btn}>
                <Button 
                    type="primary" htmlType="submit" loading={state.loading_btn} >
                    {
                        state.status_form == "create"
                        ?
                        "Save"
                        :
                        "Update"
                    }
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FormList;