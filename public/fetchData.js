const XLSX = require("xlsx");

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function loadFile(fileName) {
  const workbook = XLSX.readFile(fileName);
  let workSheet = workbook.Sheets[workbook.SheetNames[0]];
  let maxEntriesLength = workSheet["!ref"].match(/\d+$/gi)[0]; // This return the maximun ammount of entries that the file ever had. Thats why it's maximun and not the exact ammount
  let columnLength = letters.indexOf(
    workSheet["!ref"].match(/(?<=:)[a-z]/gi)[0]
  );
  const columnNames = [];
  for (let index = 0; index <= columnLength; index++) {
    let columnName = workSheet[`${letters[index]}1`] ? workSheet[`${letters[index]}1`].v : `Empty${index}`;
    columnNames.push(columnName);
  }

  return [maxEntriesLength, columnLength, columnNames, workSheet];
}

async function fetchDataFromXLSX(xlsxFile) {
  const [maxEntriesLength, columnLength, columnNames, workSheet] =
    loadFile(xlsxFile);
  const xlsxData = [];
  for (let row = 2; row <= maxEntriesLength; row++) {
    if (workSheet[`A${row}`] == undefined) {
      break;
    }
    let myObj = { xlsxCellId: row };
    for (let column = 0; column <= columnLength; column++) {
      let letter = letters[column];
      let value = workSheet[letter + row] ? workSheet[letter + row].v : "";
      myObj[columnNames[column]] = value;
    }
    xlsxData.push(myObj);
  }
  return xlsxData;
}

async function fetchSampleDataFromXLSX(xlsxFile) {
  const [maxEntriesLength, columnLength, columnNames, workSheet] =
    loadFile(xlsxFile);
  const xlsxData = {};
  for (let index = 0; index <= columnLength; index++) {
    let letter = letters[index];
    let columnName = columnNames[index];
    let value = workSheet[`${letter}${2}`] ? workSheet[`${letter}${2}`].v : "[No tiene Valor de muestra]";
    xlsxData[columnName] = value;
  }

  return [[{ entries: maxEntriesLength, columns: columnLength + 1 }], xlsxData];
}

module.exports = { fetchDataFromXLSX, fetchSampleDataFromXLSX };
