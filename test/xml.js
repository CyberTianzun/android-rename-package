'use strict';

var expat = require('node-expat')

var parser = new expat.Parser('utf-8')

var content = '<html\n\n><head>\n<title>Hello World</title>\n</head>\n<body>\n<p>\nFoobar\n</p>\n</body>\n</html>'
var lines = content.split('\n')
var currentLineNumber

var temp = 0

parser.on('startElement', function (name, attrs) {
    console.log(temp, currentLineNumber, name)
    temp = currentLineNumber
})

parser.on('endElement', function (name) {
    temp = currentLineNumber
    
})

parser.on('processingInstruction', function (target, data) {
  console.log('processingInstruction')
  console.log(target)
  console.log(data)
})

parser.on('text', function (text) {
    console.log(text)
})

parser.on('error', function (error) {
    console.error(error)
})

for(var i in lines) {
    currentLineNumber = i
    parser.write(lines[i])
}
