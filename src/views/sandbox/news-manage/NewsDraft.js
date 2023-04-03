import React from 'react'
import { Button, Modal, Table,notification, Tag,Popover, Switch } from 'antd';
import { useEffect,useState } from 'react';
import axios from 'axios'
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { confirm } = Modal;



export default function NewsDraft() {
  const {username}=JSON.parse(localStorage.getItem("token"))
  const [datasource,setdataSource]= useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
      const list = res.data
      setdataSource(list)
    })
  },[username])

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
    title: '新闻标题',
    dataIndex: 'title',
    render:(title,item)=>{
      return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    }
  },
  {
    title: '作者',
    dataIndex: 'author',

  },
  {
    title: '分类',
    dataIndex: 'category',
    render:(category)=>{
      return category.title
    }
  },
  {
    title: '操作',
    render:(item)=>{
      console.log(item,"liziwei11")
      return <div>
        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}/>
        
        <Button type="primary" shape="circle" icon={<EditOutlined />}  onClick={()=>{
          navigate(`/news-manage/update/${item.id}`)
        }}/>
        <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)} />
       
      </div>
    }
  }
];

const handleCheck=(id)=>{
  axios.patch(`/news/${id}`,{
    auditState:1
  }).then(res=>{
    navigate('/audit-manage/list')
    notification.info({
      message: `通知`,
      description:
        `您可以到审核列表中查看您的新闻`,
      placement:"bottomRight",
    });
  })
}


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
    axios.delete(`/news/${item.id}`)
  }


  // console.log(datasource,"liziwei")
  return (
    <div>
      <Table columns={columns} dataSource={datasource} 
        pagination={{
          pageSize:5
        }}
        rowKey={item=>item.id}
      />
    </div>
  )
}