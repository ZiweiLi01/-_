import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Modal, Table, Tag,Popover, Switch,Form , Input} from 'antd';

import axios from 'axios'
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCategory() {
  const [datasource,setdataSource]= useState([])
  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setdataSource(res.data)
    })
  },[])

const handleSave=(record)=>{
  setdataSource(datasource.map(item=>{
    if(item.id===record.id){
      return {
        id:item.id,
        title:record.title,
        value:record.title
      }
    }
    return item
  }))
  axios.patch(`/categories/${record.id}`,{
    title:record.title,
    value:record.title
  })
}

//表格的列名
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',  
    render:(id)=>{
      return <b>{id}</b>
    }
  },
  {
    title: '栏目名称',
    dataIndex: 'title',
    onCell: (record) => ({
      record,
      editable: true,
      dataIndex: 'title',
      title: '栏目名称',
      handleSave: handleSave,
    })
  
  },
  {
    title: '操作',
    render:(item)=>{
      return <div>
        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}/>
      </div>
    }
  }
];

const confirmMethod=(item)=>{
  confirm({
    title: '你确定要删除?',
    icon: <ExclamationCircleOutlined />,
    // content: 'Some descriptions',
    onOk() {
      deleteMethod(item)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
  
  const deleteMethod=(item)=>{
    console.log(item)
  
    setdataSource(datasource.filter(data=>data.id!==item.id))
    axios.delete(`/categories/${item.id}`)

  }


  // console.log(datasource,"liziwei")
  return (
    <div>
      <Table columns={columns} dataSource={datasource} 
        pagination={{
          pageSize:5
        }}
        rowKey={item=>item.id}

        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </div>
  )
}
