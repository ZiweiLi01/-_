import React,{ useEffect,useState } from 'react'
import { Button, Table, Modal,Tree } from 'antd';
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList() {
  const [datasource,setdataSource]= useState([])
  const [rightList,setrightList]= useState([])
  const [currentRights,setcurrentRights]= useState([])
  const [currentId,setcurrentId]= useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);  //弹出框的显示状态
  const columns=[
    {
      title: 'ID',
      dataIndex: 'id',  
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render:(item)=>{
        // console.log(item,"liziwei11")
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}/>
          
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
            setIsModalOpen(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
            }}  />
          
        </div>
      }
    }
  ]

  useEffect(()=>{
    axios.get("/roles").then(res=>{
      // console.log(res)
      setdataSource(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      // console.log(res)
      setrightList(res.data)
    })
  },[])

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
      axios.delete(`/roles/${item.id}`)
  }
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setdataSource(datasource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{rights:currentRights})
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheck=(checkedKeys)=>{
    setcurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table columns={columns} dataSource={datasource} rowKey={(item)=>item.id} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Tree
      checkable
      checkedKeys={currentRights}
      checkStrictly={true}
      onCheck={onCheck}
      treeData={rightList}
    />
      </Modal>

    </div>
  )
}
