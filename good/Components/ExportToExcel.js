import * as XLSX from 'xlsx'

const exportToExcel = () => {
//   const userCtx=useContext(userContext)

let user={firstName:sessionStorage.getItem('firstName'),lastName:sessionStorage.getItem('lastName'),idNumber:sessionStorage.getItem('idNumber'),
dataOfBirth:sessionStorage.getItem('date'),gender:sessionStorage.getItem('gender'),HMO:sessionStorage.getItem('HMO'),numOfChildren:sessionStorage.getItem('numOfChildren')
}
const children=[]
for (let i = 1; i <= sessionStorage.getItem('numOfChildren'); i++) {
  children.push({name:sessionStorage.getItem(`child${i}Name`),idNumber:sessionStorage.getItem(`child${i}idNumber`),dateOfBirth:sessionStorage.getItem(`child${i}DateOfBirth`)})
}
  var data = JSON.parse('['+JSON.stringify(user)+']')
  const ws = XLSX.utils.json_to_sheet(data);
  var data2 = JSON.parse(JSON.stringify(children))
  const ws2 = XLSX.utils.json_to_sheet(data2);
  const wb = { Sheets: { user: ws ,children:ws2}, SheetNames: ['user','children'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataURL = URL.createObjectURL(new Blob([excelBuffer], { type: 'application/octet-stream' }));
  const link = document.createElement('a');
  link.href = dataURL;
  link.setAttribute('download', 'data.xlsx');
  document.body.appendChild(link);
  link.click();
};

export default exportToExcel ;
