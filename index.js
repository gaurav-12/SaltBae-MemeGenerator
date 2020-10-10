let http = require('http')
let fs = require('fs')

http.createServer((req, res) => {
    let file = ''

    if (req.url.includes('/public/images')) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream('.' + req.url).pipe(res);
        file = 'image'
    }

    if (file != 'image') {
        switch (req.url) {
            case '/styles.css':
                file = 'styles.css'
                break;

            case '/script.js':
                file = 'script.js'
                break;

            default:
                file = 'index.html'
                break;
        }

        fs.readFile(file, (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/' + file.split('.')[1] })
            res.write(content);
            res.end()
        })
    }
}).listen(8080);

console.log('Serving at http://localhost:8080/')