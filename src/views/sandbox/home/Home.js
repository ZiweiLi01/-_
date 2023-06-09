import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd';
import { Avatar,List,Card, Col, Row,Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import _ from 'lodash'
import  * as Echarts  from 'echarts';

const { Meta } = Card;
export default function Home() {
  const [viewList,setviewList] = useState([])
  const [starList,setstarList] = useState([])
  const [allList,setallList] = useState([])
  const barRef=useRef()
  const pieRef=useRef()
  const [open, setOpen] = useState(false);
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res=>{
      setviewList(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res=>{
      setstarList(res.data)
    })
  },[])

  useEffect(()=>{
//#################################################################
    axios.get("/news?publishState=2&_expand=category").then(res=>{
      
      renderBarView(_.groupBy(res.data,item=>item.category.title))

      setallList(res.data)
    })
    return ()=>{
      window.onresize=null
    }
  },[])

  const renderBarView=(obj)=>{
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel:{
          rotate:"45",
          interval:0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize=()=>{
      myChart.resize()
    }

  } 
  //#################################################################
  const renderPieView=()=>{

    var currentList=allList.filter(item=>item.author===username)
    var groupObj=_.groupBy(currentList,item=>item.category.title)

    var list=[]
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
    console.log("liziwei",list)

    var myChart =Echarts.init(pieRef.current)
    var option
    option = {
      title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['科学技术', '时事新闻', '环球经济', '军事世界', '世界体育','生活理财']
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: list,
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
  option && myChart.setOption(option);
  
  }

  const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
          <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
        <Card
            
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            
            actions={[
              <SettingOutlined key="setting" onClick={()=>{
                Promise.resolve(setOpen(true)).then(()=>{
                  renderPieView()
                })
                
                
                
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region?region:"全球"}</b>
                  <span style={{
                    paddingLeft:"30px"
                  }}>
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer 
        width="500px"
        title="个人新闻分类" 
        placement="right" 
        onClose={()=>{
          setOpen(false)
        }} 
        open={open}
        
      >
        <div ref={pieRef} style={{
          width:"100%",
          height:"400px"
          }}>
        </div>

      </Drawer>

      <div ref={barRef} style={{
        width:"100%",
        height:"400px"
      }}>

      </div>
      


  </div>
);
  
}
