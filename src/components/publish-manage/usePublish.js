import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notification } from 'antd';

function usePublish(type){
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [datasource,setdataSource]=useState([])
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
      setdataSource(res.data)
    })
  },[username,type])

  const handlePublish=(id)=>{
    setdataSource(datasource.filter(item=>item.id!==id))
    axios.patch(`/news/${id}`,{
      "publishState":2,
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您可以到[发布管理/已发布]中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }

  const handleSunset=(id)=>{
    setdataSource(datasource.filter(item=>item.id!==id))
    axios.patch(`/news/${id}`,{
      "publishState":3,
      "publishTime":Date.now()
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您可以到[发布管理/已下线]中查看您的新闻`,
        placement:"bottomRight",
      });
    })

  }

  const handleDelete=(id)=>{
    setdataSource(datasource.filter(item=>item.id!==id))
    axios.delete(`/news/${id}`).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您已经删除了已下线的新闻`,
        placement:"bottomRight",
      });
    })
  }

  return {
    datasource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePublish