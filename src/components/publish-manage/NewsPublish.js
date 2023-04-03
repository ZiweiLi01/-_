import React from 'react'
import { Button, Modal, Table, Tag,Popover, Switch } from 'antd';
import { useEffect,useState } from 'react';
import axios from 'axios'
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export default function NewsPublish(props) {
console.log("liziwei",props.dataSource)
//表格的列名
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
        {props.button(item.id)}
      </div>
    }
  }
];


  // console.log(datasource,"liziwei")
  return (
    <div>
      <Table columns={columns} dataSource={props.dataSource} 
        pagination={{
          pageSize:5
        }}
        rowKey={item=>item.id}
      />
    </div>
  )
}

