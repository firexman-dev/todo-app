import React, {useEffect, useReducer} from 'react';
import { Button, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import { useDeleteListMutation, useGetListMutation } from '@/store/api/lists/listApi';
import { useCookies } from 'react-cookie';
import styles from "./list.module.css"
import FormList from './form';
import Link from 'next/link';

interface DataType {
  uuid: string;
  name: string;
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
          data: state.data.map((item:any) => {
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
          data: state.data.filter((item:any) => item.uuid !== action.payload),
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
    default:
      return state;
  }
}

const Tables: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      width:"32%",
      title: 'Id',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Action",
      dataIndex: "uuid",
      width: 180,
      align: "center" as const,
      render: (id: number, data: any) => (
        <Space size="middle">
          <Link href={`/lists/${id}`}>
            <EyeFilled style={{ color: 'black' }} />
          </Link>
            <EditFilled onClick={() => edit(data)} />
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
    status_form: "create",
  });
  const [cookies] = useCookies(['todo-token']);
  const token = cookies["todo-token"]
  const [ getList, { isLoading }] = useGetListMutation();
  const [ deleteList ] = useDeleteListMutation();

  const fetchList = async () =>{
    try {
      const response : any = await getList(token);
      // Access the response data
      setState({ type: "SET_DATA", payload: response.data});
      
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchList()
  },[])
  const showModal = () => {
    setState({ type: "SET_MODAL", payload: true});
    setState({ type: "STATUS_FORM", payload: "create"});
  };
  const deleteHandler = (id: number) => {
    deleteList({id, token});
    setState({ type: "DELETE_ELEMENT", payload: id});
  };
  const edit = (data: []) => {
    setState({ type: "SET_MODAL", payload: true});
    setState({ type: "STATUS_FORM", payload: "edit"});
    setState({ type: "UPDATE_ITEM", payload: data});
  };

  return(
    <>
      <div className={styles.button}>
          <Button  onClick={showModal} type="primary">+ Create list</Button>
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