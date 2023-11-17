import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select, notification } from 'antd';
import styles from "./task.module.css"
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/store/api/tasks/taskApi';
import { useCookies } from 'react-cookie';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';


type NotificationType = 'success' | 'info' | 'warning' | 'error';

const { Option } = Select;

const FormTask = ({state, setState}: any) => {
    const [ createTask, { isLoading }] = useCreateTaskMutation();
    const [ updateTask ] = useUpdateTaskMutation();
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
        form.setFieldsValue({ ["text"]: state.update_item?.text });
        form.setFieldsValue({ ["listUuid"]: state.update_item?.List?.uuid });
        form.setFieldsValue({ ["completed"]: state.update_item?.completed });
        setState({ type: "SET_LIST_ID", payload: state.update_item?.List?.uuid});
        setState({ type: "SET_CHECKED", payload: state.update_item?.completed});
    } else {
      form.resetFields();
    }
  }, [state.update_item?.uuid, state.status_form]);
  
  const onFinish = async (values: any) => {
    setState({ type: "SET_LOADING_BTN", payload: true});
    const update_id = state.update_item?.uuid;
    values = {...values, completed: state.checked};
    try {
        if (state.status_form === "create"){
            const response : any = await createTask({values, token });
            // Access the response data
            if (response.data.status != "fail"){
              setState({ type: "SET_TRIGGER", payload: !state.trigger});
              setState({ type: "SET_MODAL", payload: false});
              setState({ type: "SET_LOADING_BTN", payload: false});
              setState({ type: "UPDATE_ITEM", payload: null});
              openNotificationWithIcon("success", "added item");
              form.resetFields();
              } else {
                openNotificationWithIcon("error", "");
              }
        } else {
            const response : any = await updateTask({values, token, update_id });
            // Access the response data
            if (response.data.status == "success"){
                values = {...values, uuid: update_id};
                setState({ type: "SET_TRIGGER", payload: !state.trigger});
                setState({ type: "SET_MODAL", payload: false});
                setState({ type: "SET_LOADING_BTN", payload: false});
                setState({ type: "UPDATE_ITEM", payload: null});
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
      <Modal title="Task" footer={null} open={state.modal} onOk={handleOk} onCancel={handleCancel}>
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
            >
            <Form.Item
                name="text"
                rules={[{ required: true, message: 'Text is required!' }]}
            >
                <Input placeholder="Text" className={styles.input} />
            </Form.Item>
            <Form.Item
              name="listUuid"
              rules={[{ required: true, message: "List id is required!" }]}
            >
              <Select
                value={state.list_id}
                placeholder="Select..."
                onChange={(e) => setState({ type: "SET_LIST_ID", payload: e})}
              >
                {state.lists?.length > 0
                  ? state.lists?.map((item: any, index: number) => {
                      return (
                        <Option key={`list-${index}`} value={item.uuid}>
                          {item.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </Form.Item>
              <Checkbox onChange={(e:CheckboxChangeEvent) => setState({ type: "SET_CHECKED", payload: e.target.checked})} checked={state.checked}>Completed</Checkbox>            
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

export default FormTask;