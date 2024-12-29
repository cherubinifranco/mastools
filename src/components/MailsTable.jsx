export default function MailsTable(props) {
  const array = props.array;
  const head = props.head;
  return (
    <div className="max-w-[700px]">
      {array.length > 0 && (
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-extracontent rounded-t-lg text-white">
            <tr>
              {Object.keys(array[0]).map((el, index) => (
                <th scope="col" className="px-6 py-3" key={el + index}>
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {array.map((obj, index) => (
              <tr className="bg-content text-white border-t border-border" key={index}>
                {Object.values(obj).map((el, index) => (
                <th scope="col" className="px-6 py-3" key={el + index}>
                  {el}
                </th>
              ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}