
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function UnPublished() {
  
  const {datasource,handlePublish}=usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={datasource} button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>
          发布
        </Button>} 
      ></NewsPublish>
    </div>
  )
}
