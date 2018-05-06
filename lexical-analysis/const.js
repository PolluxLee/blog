const rule = {
  'keyword': [
    { id: 1, value: 'if' },
    { id: 2, value: 'else' },
    { id: 3, value: 'for' },
    { id: 4, value: 'while' },
    { id: 5, value: 'switch' },
    { id: 6, value: 'case' },
    { id: 7, value: 'let' },
    { id: 8, value: 'var' },
    { id: 9, value: 'const' },
    { id: 10, value: 'function' },
    { id: 31, value: 'return' },
    { id: 32, value: 'undefined' },
    { id: 33, value: 'true' },
    { id: 34, value: 'false' },
    { id: 35, value: 'null' },
    { id: 46, value: 'console' },
    { id: 47, value: 'log' },
  ],
  'variable': [{ id: 11, regExp: /^[_a-zA-Z][_a-zA-Z0-9]*$/, value: '标识符' }],
  'single': [
    { id: 23, value: ';' },
    { id: 24, value: ',' },
    { id: 27, value: '!' },
    { id: 36, value: '(' },
    { id: 37, value: ')' },
    { id: 38, value: '{' },
    { id: 39, value: '}' },
    { id: 40, value: '[' },
    { id: 41, value: ']' },
    { id: 48, value: '.' },
    { id: 52, value: '%' },
    { id: 12, value: '+' },
    { id: 13, value: '-' },
    { id: 14, value: '*' },
    { id: 15, value: '/' },
    { id: 17, value: '<' },
    { id: 19, value: '>' },
    { id: 22, value: '=' },
    { id: 62, value: '!' },
  ],
  'double': [
    { id: 16, value: '<=' },
    { id: 18, value: '>=' },
    { id: 20, value: '==' },
    { id: 42, value: '=>' },
    { id: 43, value: '++' },
    { id: 44, value: '--' },
    { id: 60, value: '&&' },
    { id: 61, value: '||' }
  ],
  'const': [
    { id: 45, value: '数字'}
  ]
}

const defaultCode = 
`const _getSum = () => {
  let sum = 0;
  for (let i = 0; i < 100; i ++) {
    if (i % 2 == 0 && i > 10) {
      sum = sum + i;
    }
  }
  return sum;
}

let sum = _getSum();
console.log(sum);`

const resultTemp = [
  { id: 1, value: 'if', type: 'keyword' }
]

//识别关键字和变量的开头
const isVarStart = el => {
  return (el >= 'a' && el <= 'z') || (el >= 'A' && el <= 'Z') || el === '_'
}

//识别字母
const isVarIncludes = el => {
  return (el >= 'a' && el <= 'z') || (el >= 'A' && el <= 'Z') || el === '_' || (el >= '0' && el <= '9')
}

//是否存在此字符
const isCharExist = c => {
  return rule.single.findIndex(el => el.value === c) !== -1
    || rule.double.findIndex(el => el.value.includes(c)) !== -1
}

//识别单字符
const isInSingleChar = c => {
  return rule.single.findIndex(el => el.value === c) 
}

//识别双字符, 返回数组下标
const isInDoubleChar = str => {
  return rule.double.findIndex(el => el.value.includes(str))
}

//识别数字
const isInt = n => {
  return Number.isInteger(parseInt(n))
}

//清除表格
const clearTable = _ => {
  let lexicalTable = document.getElementsByClassName('lexical__table')[0]
  let node = document.createElement('div')
  node.classList.add('lexical__table')
  lexicalTable.parentNode.replaceChild(node, lexicalTable)
}

//清除结果
const clearResult = _ => {
  let lexicalDisplay = document.getElementsByClassName('lexical__display')[0]
  let node = document.createElement('div')
  node.classList.add('lexical__display')
  lexicalDisplay.parentNode.replaceChild(node, lexicalDisplay)
}

//判断 index 在代码中的行数
const findLineByIndex = (idx, code) => {
  if (typeof code !== 'string') return 0
  let enterCnt = 0
  for (let i=idx; i>=0; i--) {
    if (code[i] === '\n') enterCnt++
  }
  return enterCnt + 1
}