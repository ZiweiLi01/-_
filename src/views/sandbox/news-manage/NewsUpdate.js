import React,{useEffect, useState,useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@ant-design/pro-layout';
import { Steps,Button, Checkbox,notification, Form, Input,Select,message } from 'antd';
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Option } = Select;

const User = JSON.parse(localStorage.getItem("token"))

export default function NewsUpdate() {
  const [current,setCurrent]=useState(0)
  const [categoryList,setcategoryList]=useState([])

  const [formInfo,setformInfo]=useState({})
  const [content,setcontent]=useState("")
  
  
  const navigate=useNavigate()
  const NewsForm = useRef(null)

  const params =useParams()
  // const [newsInfo,setnewsInfo]=useState(null)

  useEffect(()=>{
    // console.log(params.id,'liziwei')
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{
      let {title,categoryId,content}=res.data
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setcontent(content)
      // console.log(res)
    })
  },[])
  
  const handleNext=()=>{
    if(current===0){
      NewsForm.current.validateFields().then(res=>{
        setformInfo(res)
        setCurrent(current+1)
      }).catch(error=>{
        console.log(error)
      })
    }else{
       if(content===""||content.trim()==="<p></p>"){
        message.error("新闻内容不能为空")
       }else{
        setCurrent(current+1)
       }
    }
  }
  const handlePrevious=()=>{
    setCurrent(current-1)
  }
  
  const handleSave=(auditState)=>{
    axios.patch(`/news/${params.id}`,{
      ...formInfo,
      "content":content,
      "auditState": auditState,
    }).then(res=>{
      navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }

  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setcategoryList(res.data)
    })
  },[])
  
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="更新新闻"
        subTitle="This is a subtitle"
      />
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description:"新闻标题,新闻分类",
          },
          {
            title: '新闻内容',
            description:"新闻主体内容",
            
          },
          {
            title: '新闻提交',
            description:"保存草稿或者提交审核",
          },
        ]}
      />

      <div style={{marginTop:"50px"}}>
        <div className={current===0?'':style.active}>
        <Form
        name="basic"
        ref={NewsForm}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
  
        autoComplete="off"
        >
        <Form.Item
          label="新闻标题"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="新闻分类"
          name="categoryId"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            {
              categoryList.map(item=><Option value={item.id} key={item.id}>{item.title}</Option>)
            }
          </Select>
        </Form.Item>
  
        
        </Form>
        </div>

        <div className={current===1?'':style.active}>
          <NewsEditor getContent={(value)=>{
            setcontent(value)
          }} content={content}></NewsEditor>
        </div>
      </div>

      <div style={{marginTop:"50px"}}>
        {
          current===2 && <span>
            <Button type="primary" onClick={()=>handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current<2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current>0 && <Button onClick={handlePrevious}>上一步</Button>
          }
      </div>
    </div>
  )
}

