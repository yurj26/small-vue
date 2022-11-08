import { ElementTypes, NodeTypes } from './ast'

const enum TagType {
  Start,
  End
}

export function baseParse(content: string) {
  const context = createParserContext(content)
  console.log('source:', context)

  return parseChildren(context, [])
}

function createParserContext(content) {
  return {
    column: 1,
    line: 1,
    offset: 0,
    source: content,
    originalSource: content
  }
}

function parseChildren(context, ancestors) {
  // 解析children
  const nodes: any = []
  while (!isEnd(context, ancestors)) {
    let node
    const source = context.source
    if (source.startsWith('{{')) {
      console.log('处理插值-----------')
      node = parseInterpolation(context)
    } else if (source.startsWith('<')) {
      if (source[1] === '/') {
        // 处理结束标签
        console.log('处理结束标签------------')
        if (/[a-z]/i.test(source[2])) {
          // 匹配 </div>
          // 需要改变 context.source 的值 -> 也就是需要移动光标
          parseTag(context, TagType.End)
          continue
        }
      } else if (/[a-z]/i.test(source[1])) {
        console.log('处理开始标签------------')
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      console.log('处理文本------------')
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function parseInterpolation(context) {
  // {{ value }}
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )
  // 删除 {{
  advanceBy(context, 2)
  // 插值内容的长度
  const rawContentLength = closeIndex - openDelimiter.length
  // 插值中的内容
  const rawContent = context.source.slice(0, rawContentLength)

  const preTrimContent = parseTextData(context, rawContent.length)
  const content = preTrimContent.trim()
  // 删除 }}
  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function parseElement(context, ancestors) {
  const element = parseTag(context, TagType.Start)
  console.log('parseTag', element)

  ancestors.push(element)
  const children = parseChildren(context, ancestors)
  ancestors.pop()

  // 解析 end tag 是为了检测语法是不是正确的
  // 检测是不是和 start tag 一致
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End)
  } else {
    throw new Error(`缺失结束标签：${element.tag}`)
  }

  element.children = children
  return element
}

function parseTag(context: any, type: TagType): any {
  // 发现如果不是 > 的话，那么就把字符都收集起来 ->div
  const match: any = /^<\/?([a-z][^\r\n\t\f />]*)/i.exec(context.source)
  console.log('matchTag', match)
  const tag = match[1]

  // 移动光标
  // <div
  advanceBy(context, match[0].length)

  advanceBy(context, 1)

  if (type === TagType.End) return

  let tagType = ElementTypes.ELEMENT

  return {
    type: NodeTypes.ELEMENT,
    tag,
    tagType
  }
}

function parseText(context) {
  const endTokens = ['<', '{{']
  const source = context.source
  // 获取文本的结束坐标，默认为length
  let endIndex = source.length
  for (let i = 0; i < endTokens.length; i++) {
    const index = source.indexOf(endTokens[i])
    // 123 {{abc}} <div></div> 依次去比较index，取最小的，就是{{
    if (index !== -1 && index < endIndex) {
      endIndex = index
    }
  }
  const content = parseTextData(context, endIndex)
  console.log('parseText:', content)
  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData(context: any, length: any): any {
  const rawText = context.source.slice(0, length)
  // 移动光标
  advanceBy(context, length)

  return rawText
}

function advanceBy(context, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters)
}
function isEnd(context, ancestors) {
  const s = context.source
  if (context.source.startsWith('</')) {
    // 从后面往前面查
    // 因为便签如果存在的话 应该是 ancestors 最后一个元素
    for (let i = ancestors.length - 1; i >= 0; --i) {
      if (startsWithEndTagOpen(s, ancestors[i].tag)) {
        return true
      }
    }
  }
  return !context.source
}

function startsWithEndTagOpen(source: string, tag: string) {
  // 1. 头部 是不是以  </ 开头的
  // 2. 看看是不是和 tag 一样
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  )
}

function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString)
}
