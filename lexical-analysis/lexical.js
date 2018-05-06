let code = ''
let result = []

let inputNode = document.getElementById('input')
inputNode.value = defaultCode
let analyzeNode = document.getElementById('analyze')
let defaultNode = document.getElementById('default')
let clearNode = document.getElementById('clear')

//创建字符表
Promise.resolve().then(_ => {
  createLexicalTable()
})

//监听词法分析按钮
analyzeNode.onclick = _ => {
  code = inputNode.value
  console.log(code)
  result = []
  clearResult()
  Promise.resolve().then(lexicalAnalysis).then(lexicalDisplay)
}

//监听默认代码按钮
defaultNode.onclick = _ => {
  inputNode.value = defaultCode
}

//监听清除按钮
clearNode.onclick = _ => {
  inputNode.value = ''
  clearResult()
}

//词法分析
const lexicalAnalysis = _ => {
  let j, tmp, index
  for (let i = 0; i < code.length; i++) {

    switch (true) {
      //判断是否是关键字或变量
      case isVarStart(code[i]):
        j = i + 1
        while (isVarIncludes(code[j])) j++
        tmp = code.substring(i, j)
        index = rule.keyword.findIndex(el => el.value === tmp)
        // check keyword
        if (index !== -1) {
          result.push({ id: rule.keyword[index].id, value: tmp, type: '关键字' })
          i = j - 1
          break
        }
        // check var
        if (rule.variable[0].regExp.test(tmp)) {
          result.push({ id: rule.variable[0].id, value: tmp, type: '标识符' })
          i = j - 1
          break
        }
        // not match, error, TODO get error line
        break

      case isCharExist(code[i]):
        index = isInDoubleChar(code[i] + code[i + 1])
        if (index !== -1) {
          result.push({ id: rule.double[index].id, value: code[i] + code[i + 1], type: '字符' })
          i = i + 1
          break
        }

        index = isInSingleChar(code[i])
        result.push({ id: rule.single[index].id, value: code[i], type: '字符' })
        break

      case isInt(code[i]):
        j = i + 1
        while (isInt(code[j])) j++
        tmp = code.substring(i, j)
        result.push({ id: rule.const[0].id, value: tmp, type: '数字' })
        i = j - 1
        break
      default:
        if (!code[i].trim() || code[i]==='\n') break
        let line = findLineByIndex(i, code)
        alert(`无法识别字符 '${code[i]}' @line ${line}`)
        return
    }
  }
}

//创建 lexical__table
const createLexicalTable = _ => {
  let lexicalTable = document.getElementsByClassName('lexical__table')[0]
  let node = document.createElement('div')
  node.classList.add('lexical__table')

  let child = {
    'keyword': { p: '', title: '', table: '' , remark: '关键字'},
    'variable': { p: '', title: '', table: '', remark: '标识符'},
    'single': { p: '', title: '', table: '', remark: '单目字符'},
    'double': { p: '', title: '', table: '', remark: '双目字符'},
    'const': { p: '', title: '', table: '', remark: '数字'},
  }

  for (let key in child) {
    child[key].p = document.createElement('p')
    child[key].p.classList.add('lexical__title--p')
    child[key].p.innerText = child[key].remark
    child[key].title = document.createElement('div')
    child[key].title.classList.add('lexical__title--table')
    child[key].title.appendChild(child[key].p)
    child[key].table = document.createElement('table')
    node.appendChild(child[key].title)
    node.appendChild(child[key].table)
    let tr = document.createElement('tr')
    let th1 = document.createElement('th')
    let th2 = document.createElement('th')
    th1.innerText = '种别编码'
    th2.innerText = '单词符号'
    tr.appendChild(th1)
    tr.appendChild(th2)
    child[key].table.appendChild(tr)
    for (let i=0; i<rule[key].length; i++) {
      let tr = document.createElement('tr')
      let td1 = document.createElement('td')
      let td2 = document.createElement('td')
      td1.innerText = rule[key][i].id
      td2.innerText = rule[key][i].value
      tr.appendChild(td1)
      tr.appendChild(td2)
      child[key].table.appendChild(tr)
    }
  }
  lexicalTable.parentNode.replaceChild(node, lexicalTable)
  console.log(node)
}

//词法分析结果打印
const lexicalDisplay = _ => {
  console.log(result)
  let node = document.createElement('div')
  node.classList.add('lexical__display')
  let oldNode = document.getElementsByClassName('lexical__display')[0]
  for (let el of result) {
    node.appendChild(createItemNode(el.id, el.value, el.type))
  }
  oldNode.parentNode.replaceChild(node, oldNode)
}

//创建 lexical__item 节点
const createItemNode = (id, value, remark) => {
  let item = document.createElement('div')
  let itemId = document.createElement('div')
  let itemVal = document.createElement('div')
  let itemRemark = document.createElement('div')
  let p1 = document.createElement('p')
  let p2 = document.createElement('p')
  let p3 = document.createElement('p')
  item.classList.add('lexical__item')
  itemId.classList.add('lexical__item--id')
  itemVal.classList.add('lexical__item--value')
  itemRemark.classList.add('lexical__item--remark')
  itemId.appendChild(p1)
  itemVal.appendChild(p2)
  itemRemark.appendChild(p3)
  item.appendChild(itemId)
  item.appendChild(itemVal)
  item.appendChild(itemRemark)
  itemId.childNodes[0].innerText = id
  itemVal.childNodes[0].innerText = value
  itemRemark.childNodes[0].innerText = remark
  return item
}





