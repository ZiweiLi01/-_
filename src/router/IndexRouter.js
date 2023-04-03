import React,{useEffect,useState} from 'react'
import { HashRouter,Navigate,Route,Routes } from 'react-router-dom'
import axios from 'axios'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import Home from '../views/sandbox/home/Home'
import UserList from '../views/sandbox/userlist/UserList'
import RoleList from '../views/sandbox/rolelist/RoleList'
import RightList from '../views/sandbox/rightlist/RightList'
import NoPermission from '../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import Audit from '../views/sandbox/audit/Audit'
import AuditList from '../views/sandbox/audit/AuditList'
import Unpublished from '../views/sandbox/publish-manage/Unpublished'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate'
import MySpin from './Myspin'
import News from '../views/news/News'
import Detail from '../views/news/Detail'


const LoaclRouterMap={
  "/home": Home,
  "/user-manage/list":<UserList/>,
  "/right-manage/role/list":<RoleList/>,
  "/right-manage/right/list":<RightList/>,
  "/news-manage/add":<NewsAdd/>,
  "/news-manage/draft":<NewsDraft/>,
  "/news-manage/category":<NewsCategory/>,
  "/news-manage/preview/:id":<NewsPreview/>,
  "/news-manage/update/:id":<NewsUpdate/>,
  "/audit-manage/audit":<Audit/>,
  "/audit-manage/list":<AuditList/>,
  "/publish-manage/unpublished":<Unpublished/>,
  "/publish-manage/published":<Published/>,
  "/publish-manage/sunset":<Sunset/>,
}

export default function IndexRouter() {
  const [BackRouteList,setBackRouteList]=useState([])
  useEffect(()=>{
    Promise.all([
      axios.get("/rights"),
      axios.get("/children")
    ]).then(res=>{
      setBackRouteList([...res[0].data,...res[1].data])
      // console.log(BackRouteList,"2023/1/5")
    })
  },[])

  // const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
  

  // const checkRoute=(item)=>{
    
  //   return LoaclRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  // }
  // const checkUserPermission=(item)=>{
  //   return rights.includes(item.key)
  // }

  return (
    
    <HashRouter>
      <Routes>
        <Route path="/login" element={ <Login></Login> }/>
        <Route path="/news" element={ <News></News> }/>
        <Route path="/detail/:id" element={ <Detail></Detail> }/>
        <Route path="/" element={ localStorage.getItem("token")?<NewsSandBox></NewsSandBox>:<Navigate to="/login"/> }>
          <Route path='/*' element={<MySpin></MySpin>}></Route>
          
        </Route>
        <Route path="*" element={<NoPermission/>}/>
      </Routes>

    </HashRouter>
    
  )
}
