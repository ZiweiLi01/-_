import React from 'react'
import { Button, Modal, Table, Tag,Popover, Switch } from 'antd';
import { useEffect,useState } from 'react';
import axios from 'axios'
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export default function RightList() {
  const [datasource,setdataSource]= useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      const list = res.data
      list.forEach(item=>{
        if(item.children.length===0){
          item.children=""
        }
      })
      // if (list[0].children){
      //   console.log(list[0].children,"liziwei")
      // }
      setdataSource(res.data)
    })
  },[])

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
    title: '权限名称',
    dataIndex: 'title',
  },
  {
    title: '权限路径',
    dataIndex: 'key',
    render:(key)=>{
      return <Tag color="orange">{key}</Tag>
    }
  },
  {
    title: '操作',
    render:(item)=>{
      console.log(item,"liziwei11")
      return <div>
        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}/>
        <Popover content={
          <div style={{textAlign:"center"}}>
            <Switch checked={item.pagepermission} onChange={()=>switchMethod(item)}></Switch>
          </div>
        } title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined} />
        </Popover>
      </div>
    }
  }
];

const switchMethod=(item)=>{
  item.pagepermisson=item.pagepermisson===1?0:1
  setdataSource([...datasource])
  //后端
  if(item.grade===1){
    axios.patch(`/rights/${item.id}`,{
      pagepermisson:item.pagepermisson
    })
  }else{
    axios.patch(`/children/${item.id}`,{
      pagepermisson:item.pagepermisson
    })
  }
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
    if(item.grade===1){
      setdataSource(datasource.filter(data=>data.id!==item.id))
      axios.delete(`/rights/${item.id}`)
    }else{
      // console.log(item.rightId,"liziwei111")
      let list=datasource.filter(data=>data.id===item.rightId)
      // console.log(list,"liziwei222")
      list[0].children=list[0].children.filter(data=>data.id!==item.id)
      setdataSource([...datasource])
      axios.delete(`/children/${item.id}`)
    }
  }


  // console.log(datasource,"liziwei")
  return (
    <div>
      <Table columns={columns} dataSource={datasource} 
        pagination={{
          pageSize:5
        }}
      />
    </div>
  )
}
