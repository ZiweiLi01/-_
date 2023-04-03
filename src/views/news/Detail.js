import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {useParams} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons'

export default function Detail(props) {
  const params =useParams()
  const [newsInfo,setnewsInfo]=useState(null)
  useEffect(()=>{
    // console.log(params.id,'liziwei')
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{
      setnewsInfo({
        ...res.data,
        view:res.data.view+1
      })
      // console.log(res)
      return res.data
    }).then(res=>{
      axios.patch(`/news/${props.match.params.id}`,{
        view:res.view+1
      })
    })
  },[])

  const handleStar=()=>{
    setnewsInfo({
      ...newsInfo,
      star:newsInfo.star+1
    })
    axios.patch(`/news/${props.match.params.id}`,{
      star:newsInfo.star+1
    })
  }

  return (
    <div>
      {newsInfo && <div>
        <PageHeader
        
        onBack={() => window.history.back()}
        title={newsInfo?.title}
        subTitle={<div>
              {newsInfo.category.title}
              <span style={{margin:"5px"}}></span>
              <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/>
            </div>
          }
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
            
          </Descriptions>
        </PageHeader>
        <div dangerouslySetInnerHTML={{
          __html:newsInfo.content
        }} style={{
          margin:"0 20px",
          border:"1px solid gray"
        }}>

        </div>
      </div>
      }
    </div>
  )
}
