
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function Published() {
  
  const {datasource,handleSunset}=usePublish(2)

  return (
    <div>
      <NewsPublish dataSource={datasource} button={(id)=><Button danger onClick={()=>handleSunset(id)}>
         下线
        </Button>} 
      > 
      </NewsPublish>
    </div>
  )
}
