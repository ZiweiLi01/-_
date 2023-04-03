import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function UnPublished() {
  
  const {datasource,handleDelete}=usePublish(3)

  return (
    <div>
      <NewsPublish dataSource={datasource} button={(id)=><Button onClick={()=>handleDelete(id)}>
          删除
        </Button>} 
      ></NewsPublish>
    </div>
  )
}