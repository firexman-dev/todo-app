import React, {useEffect, useReducer} from 'react';
import { Button, Popconfirm, Space, Table, Tag, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useDeleteTaskMutation, useGetTaskMutation } from '@/store/api/tasks/taskApi';
import { useCookies } from 'react-cookie';
import styles from "./task.module.css"
import FormList from './form';
import { useGetListMutation } from '@/store/api/lists/listApi';
import { Checkbox } from 'antd';

interface DataType {
  uuid: string;
  text: string;
  list: string;
}


function reducer(state:any, action:any) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
      case "ADD_ELEMENT": {
        return {
          ...state,
          data: state.data.concat(action.payload),
        };
      }
      case "UPDATE_ELEMENT": {
        return {
          ...state,
          data: state.data.map((item:any, index:number) => {
            if (item.uuid === action.payload.uuid) {
              return (action.payload);
            } else {
              return item;
            }
          }),
        };
      }
      case "UPDATE_ITEM": {
        return {
          ...state,
          update_item: action.payload,
        };
      }
      case "DELETE_ELEMENT": {
        return {
          ...state,
          data: state.data.filter((item: any) => item.uuid !== action.payload),
        };
      }
      case "STATUS_FORM": {
        return {
          ...state,
          status_form: action.payload,
        };
      }
    case "SET_MODAL":
      return {
        ...state,
        modal: action.payload,
      };
    case "SET_LOADING_BTN":
      return {
        ...state,
        loading_btn: action.payload,
      };
      case "SET_LISTS":
      return {
        ...state,
        lists: action.payload,
      };
      case "SET_LIST_ID":
      return {
        ...state,
        list_id: action.payload,
      };
      case "SET_TRIGGER":
      return {
        ...state,
        trigger: action.payload,
      };
      case "SET_CHECKED":
      return {
        ...state,
        checked: action.payload,
      };
    default:
      return state;
  }
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Tables: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      width: 100,
      title: '',
      dataIndex: 'completed',
      key: 'completed',
      render: (e:boolean) =>
      <Checkbox checked={e}></Checkbox>
    },
    {
      width:"32%",
      title: 'Id',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'List name',
      key: 'List',
      dataIndex: 'List',
      render: (e: any) =>
      <Tag style={{ borderRadius: 8 }} color="green" >
        {e?.name}
      </Tag>
    },
    {
      title: "",
      dataIndex: "uuid",
      width: 180,
      align: "center" as const,
      render: (id: string, data: any) => (
        <Space size="middle">
          <a>
            <EditFilled onClick={() => edit(data)} />
          </a>
          <Popconfirm
              onConfirm={() => deleteHandler(id)}
              title="Do you want to remove item?"
              okText="Yes"
              cancelText="No"
            >
            <DeleteFilled style={{ color: 'red' }}  />
            </Popconfirm>
        </Space>
      ),
    },
  ];
  const [state, setState] = useReducer(reducer, {
    data: false,
    modal: false,
    loading_btn: false,
    update_item: null,
    lists: null,
    list_id: null,
    status_form: "create",
    trigger: false,
    checked: false,
  });
  const [cookies] = useCookies(['todo-token']);
  const token = cookies["todo-token"]
  const [api, contextHolder] = notification.useNotification();
  const [ getTask, { isLoading }] = useGetTaskMutation();
  const [ deleteList ] = useDeleteTaskMutation();
  const [ getList] = useGetListMutation();
  const openNotificationWithIcon = (type: NotificationType, message: any) => {
    api[type]({
      message: type == "error" ? "Unsuccessfully" : "Successfully",
      description: message,
    });
  };
  const fetchTask = async () => {
    try {
      const response : any = await getTask(token);
      // Access the response data
      setState({ type: "SET_DATA", payload: response.data});
      
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }
  const fetchList = async () => {
    try {
      const response : any = await getList(token);
      // Access the response data
      setState({ type: "SET_LISTS", payload: response.data});
      
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchList()
  },[])
  useEffect(()=>{
    fetchTask()
  },[state.trigger])
  
  const showModal = () => {
    setState({ type: "SET_MODAL", payload: true});
    setState({ type: "STATUS_FORM", payload: "create"});
  };
  const deleteHandler = (id: string) => {
    deleteList({id, token});
    setState({ type: "DELETE_ELEMENT", payload: id});
    openNotificationWithIcon("success", "removed item");
  };
  const edit = (data: []) => {
    setState({ type: "SET_MODAL", payload: true});
    setState({ type: "STATUS_FORM", payload: "edit"});
    setState({ type: "UPDATE_ITEM", payload: data});
  };  

  return(
    <>
    {contextHolder}
      <div className={styles.button}>
          <Button  onClick={showModal} type="primary">+ Create task</Button>
      </div>
      <Table 
        columns={columns}
        rowKey={(record) => record.uuid}
        loading={isLoading}
        dataSource={!isLoading && state.data?.length > 0 ? state.data : []}
        />
        <FormList state={state} setState={setState} />
    </>
  )
}

export default Tables;