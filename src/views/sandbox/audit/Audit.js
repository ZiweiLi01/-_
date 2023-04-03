import axios from 'axios'
import React, { useEffect,useState } from 'react'
import { Button, Modal, Table, Tag,Popover, Switch,notification } from 'antd';

export default function Audit() {
  const [datasource,setdataSource]= useState([])
  const {roleId,region,username}=JSON.parse(localStorage.getItem("token"))
  const roleObj={
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
  }

  useEffect(()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      console.log(res.data,"qinglidan")
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.author===username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ])
    })
  },[roleId,region,username])

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
      title: '操作',
      render:(item)=>{
        console.log(item,"liziwei11")
        return <div>
          <Button type='primary' onClick={()=>{handleAudit(item,2,1)}}>通过</Button>
          <Button danger onClick={()=>{handleAudit(item,3,0)}}>驳回</Button>
          
        </div>
      }
    }
  ];

  const handleAudit=(item,auditState,publishState)=>{
    setdataSource(datasource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
      message: `通知`,
      description:
        `您可以到[审核管理/审核列表]中查看您的新闻审核状态`,
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
