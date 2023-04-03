import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import { Card, Col, Row,List } from 'antd';
import _ from 'lodash'


export default function News() {
  const [list,setlist]=useState([])
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category").then(res=>{
      
      setlist(Object.entries(_.groupBy(res.data,item=>item.category.title)))
      
    })
  },[])

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  return (
    <div style={{
      width:"95%",
      margin:"0"
    }}>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16,16]}>

          {
            list.map(item=>
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable={true}>
                <List
                  size="small"
                  dataSource={item[1]}
                  pagination={
                    {pageSize:3}
                  }
                  renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                />
                </Card>
              </Col>
            )
          }

          

          

        </Row>
      </div>
    </div>
  )
}
