import hljs from 'highlight.js/lib/highlight'

hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
hljs.registerLanguage('go', require('highlight.js/lib/languages/go'))
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
)
export default hljs
