import React, {useEffect, useReducer} from 'react';
import { Checkbox, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useGetListIdMutation } from '@/store/api/lists/listApi';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

interface DataType {
  uuid: string;
  text: string;
}

function reducer(state:any, action:any) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
      default:
      return state;
  }
}

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
    
  ];
  const [state, setState] = useReducer(reducer, {
    data: false,
    modal: false,
  });
  const router = useRouter();
  const { id } = router.query;
  const [cookies] = useCookies(['todo-token']);
  const token = cookies["todo-token"]
  const [ getListId, { isLoading }] = useGetListIdMutation();
  const fetchList = async () =>{
    try {
      const response : any = await getListId({id, token});
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
  

  return(
    <>
      <Table 
        columns={columns}
        rowKey={(record) => record.uuid}
        loading={isLoading}
        dataSource={!isLoading && state.data?.length > 0 ? state.data : []}
        />
    </>
  )
}

export default Tables;
