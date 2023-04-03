import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import { UserOutlined } from '@ant-design/icons';

import React, { useState } from 'react';

import { Avatar,Dropdown,Layout } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';

import {connect} from 'react-redux'

const { Header } = Layout;

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const navigate=useNavigate()
  const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          {roleName}
        </a>
      ),
    },
    {
      key: '4',
      danger: true,
      label: 
      <div onClick={()=>{
        localStorage.removeItem("token")
        navigate("/login")
      }}>
        <span>退出</span>
      </div>
      ,
    },
  ];

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
    {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,{
      className:'trigger',
      onClick: () => {
        props.changeCollapsed()
      },
    })}
        {/* {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })} */}

        <div style={{float:'right'}}>
          <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
          <Dropdown menu={{ items }}>
            <Avatar size={32} icon={<UserOutlined />} />
          </Dropdown>
        </div>
    </Header>
  )
}

const mapStateToProps=({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

const mapDispatchToProps ={
  changeCollapsed(){
    return {
      type:"change_collapsed"
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)
