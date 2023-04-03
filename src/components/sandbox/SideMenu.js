import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {connect} from 'react-redux'
import axios from 'axios'
import {
  
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './index.css'
import { Layout, Menu } from 'antd';
const {  Sider } = Layout;



const iconList={
  "/home":<UserOutlined/>,
  "/user-manage":<UserOutlined/>,
  "/user-manage/list":<UserOutlined/>,
  "/right-manage":<UserOutlined/>,
  "/right-manage/role/list":<UserOutlined/>,
  "/right-manage/right/list":<UserOutlined/>
  //在这里添加图标
}

function SideMenu(props) {

  const [collapsed] = useState(false);  //折叠状态
  const [menu,setMenu] =useState([])
  const navigate=useNavigate()
  const location = useLocation();



  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      console.log(res.data)
      setMenu(renderMenu(res.data))
    })
  },[])
  
  const {role:{rights}}=JSON.parse(localStorage.getItem("token"))

  const checkPagePermission=(item)=>{
    return item.pagepermisson===1 && rights.includes(item.key)
  }

  const renderMenu = (menuList)=>{
    return menuList.map(item=>{
      if(item.children?.length>0 && checkPagePermission(item)){  //看到这
        
        return {
          key:item.key,
          icon:iconList[item.key],
          children:renderMenu(item.children),
          label:item.title
        }
      }
      return checkPagePermission(item) && {
        key:item.key,
        icon:iconList[item.key],
        // children:item.children,
        label:item.title
      }
    })
  }

  

  const onClick = (e) => {
    
    navigate(e.key,{state: '我从登陆页面过来了！！！'})

  };

  const selectKeys=[location.pathname]
  const openKeys =["/"+location.pathname.split("/")[1]]
  // console.log(openKeys,"liziwei")
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
          <div className="logo">全球新闻发布管理系统</div>
          <div style={{flex:1,"overflow":"auto"}}>
            <Menu
              onClick={onClick}
              theme="dark"
              mode="inline"
              selectedKeys={selectKeys}  //高亮
              // items={[
              //   getItem('首页', '/home', <UserOutlined />),
              //   getItem('用户列表', '/user-manage', <VideoCameraOutlined />,[
              //     getItem('用户列表', '/user-manage/list',<UserOutlined />)
              //   ]),
                
              //   getItem('权限管理', '/right-manage', <SettingOutlined />, [  //名字label key值 图标icon 孩子 
              //     getItem('角色列表', '/right-manage/role/list',<UserOutlined />),
              //     getItem('权限列表', '/right-manage/right/list',<UserOutlined />),
              //   ])
              // ]}
              items={menu}
              defaultOpenKeys={openKeys}
            />
          </div>
        </div>
      </Sider>
  )
}

const mapStateToProps=({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)