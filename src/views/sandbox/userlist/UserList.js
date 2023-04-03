import React,{ useEffect,useState,useRef } from 'react'
import { Button, Table, Modal,Tree, Switch,Form,Input,Select } from 'antd';
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal;

export default function UserList() {
  const [datasource,setdataSource]= useState([])
  const [isAddVisible,setisAddVisible]= useState(false)
  const [roleList,setroleList]= useState([])
  const [regionList,setregionList]= useState([])
  const [isUpdateVisible,setisUpdateVisible]= useState(false)
  const [isUpdateDisabled,setisUpdateDisabled]= useState(false)
  const [currentUpdate,setcurrentUpdate]= useState(null)
  const addForm =useRef(null)
  const updateForm =useRef(null)

  const {roleId,region,username}=JSON.parse(localStorage.getItem("token"))
  const roleObj={
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
  }

  useEffect(()=>{
    axios.get("/users?_expand=role").then(res=>{
      console.log(res.data,"qinglidan")
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ])
    })
  },[])
  useEffect(()=>{
    axios.get("/regions").then(res=>{
      // console.log(res.data,"liziwei")
      setregionList(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      // console.log(res.data,"liziwei")
      setroleList(res.data)
    })
  },[])
  const columns=[
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        if(value==="全球"){
          return item.region===""
        }
        return item.region===value
      },
      render:(region)=>{
        return <b>{region===""?"全球":region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default}
        onChange={()=>handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        // console.log(item,"liziwei11")
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={()=>{confirmMethod(item)}}/>
          
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>{handleUpdate(item)}} />
          
        </div>
      }
    }
  ]
  const handleUpdate=(item)=>{
    
      // setisUpdateVisible(true)
      //设定值
      setisUpdateVisible_ansync().then(()=>{
        console.log(item,"liziwei")
        if(item.roleId===1){
          setisUpdateDisabled(true)
        }else{
          setisUpdateDisabled(false)
        }
        updateForm.current.setFieldsValue(item)
        
      })
      setcurrentUpdate(item)
      
    
  }

  async function setisUpdateVisible_ansync() {
    
    return setisUpdateVisible(true)
  }

  const handleChange=(item)=>{
    item.roleState=!item.roleState
    setdataSource([...datasource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
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
    setdataSource(datasource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`)
  }
  
  const addFormOK=()=>{
      console.log("onOk")
      addForm.current.validateFields().then(value=>{
        setisAddVisible(false)
        addForm.current.resetFields()
        console.log(value,"liziwei")
        //post到后端 生成id 
        axios.post(`/users`,{
          ...value,
          "roleState":true,
          "default":false,
        }).then(res=>{
          setdataSource([...datasource,{
            ...res.data,
            role:roleList.filter(item=>item.id===value.roleId)[0]
          }])
        })

      }).catch(err=>{
        console.log(err)
      })
    }
    const updateFormOK=()=>{
      console.log("onOk")
      updateForm.current.validateFields().then(value=>{
        setisUpdateVisible(false)
        
        // addForm.current.resetFields()
        // console.log(value,"liziwei")
        // //post到后端 生成id 
        // axios.post(`/users`,{
        //   ...value,
        //   "roleState":true,
        //   "default":false,
        // }).then(res=>{
          setdataSource(datasource.map(item=>{
            if(item.id===currentUpdate.id){
              return{
                ...item,
                ...value,
                role:roleList.filter(item=>item.id===value.roleId)[0]
              }
            }
            return item
          }))
          setisUpdateDisabled(!isUpdateDisabled)
          axios.patch(`/users/${currentUpdate.id}`,value)
        // })

      }).catch(err=>{
        console.log(err)
      })
    }  

  return (
    <div>
      <Button type="primary" onClick={()=>{
        setisAddVisible(true)
      }}>添加用户</Button>
        <Table columns={columns} dataSource={datasource} rowKey={(item)=>item.id}
          pagination={{
            pageSize:5
          }}
        />

      <Modal
          open={isAddVisible} 
          title="添加用户"
          okText="确定"
          cancelText="取消"
          onCancel={()=>{
            setisAddVisible(false)
          }}
          onOk={() => addFormOK()}
        >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
          open={isUpdateVisible} 
          title="更新用户"
          okText="更新"
          cancelText="取消"
          onCancel={()=>{
            setisUpdateVisible(false)
            setisUpdateDisabled(!setisUpdateDisabled)
          }}
          onOk={() => updateFormOK()}
        >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
