import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Modal, Table, Tag,Popover, Switch,notification } from 'antd';
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function AuditList() {
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [datasource,setdataSource]=useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      console.log(res,"liziwei")
      setdataSource(res.data)
    })
  },[])
  const columns = [
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
      title: '新闻分类',
      dataIndex: 'category',
      render:(category)=>{
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render:(auditState)=>{
        const auditList=["未审核","审核中","已通过","未通过"]
        const colorList=["black","orange","green","red"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        console.log(item,"liziwei11")
        return <div>
          {item.auditState===1 && <Button onClick={()=>handleRervert(item)}>撤销</Button>}
          {item.auditState===2 && <Button danger onClick={()=>handlePublish(item)}>发布</Button>}
          {item.auditState===3 && <Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>}
        </div>
      }
    }
  ];

  const handleRervert=(item)=>{
    setdataSource(datasource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }

  const handleUpdate=(item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }

  const handlePublish=(item)=>{
    axios.patch(`/news/${item.id}`,{
      "publishState":2,
      "publishTime":Date.now()
    }).then(res=>{
      navigate('/publish-manage/published')
      notification.info({
        message: `通知`,
        description:
          `您可以到[发布管理/已经发布]中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }
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
