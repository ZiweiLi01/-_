export const CollApsedReducer=(prevState={
  isCollapsed:true
},action)=>{
  let {type}=action
  switch(type){
    case "change_collapsed":
      let newstate={...prevState}
      newstate.isCollapsed=!newstate.isCollapsed
      return newstate
    default:
      return prevState
  }
  
}