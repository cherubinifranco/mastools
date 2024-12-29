export default function FormItem(props){
  return (
  <div className="relative p-1" title={props.title}>
    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
      {props.children}
    </div>
    <input
      value={props.value}
      readOnly
      type="text"
      id="input-group-1"
      className="hover:cursor-pointer border text-sm rounded-lg block w-full ps-10 p-2.5  bg-extracontent border-border placeholder-gray-400 text-white hover:bg-extra"
      placeholder={props.title}
      onClick={props.function}
    />
  </div>
)}  