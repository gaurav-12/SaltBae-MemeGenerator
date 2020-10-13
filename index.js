let http = require('http')
let fs = require('fs')

http.createServer((req, res) => {
    let file = ''

    if (req.url.includes('/public/')) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream('.' + req.url).pipe(res);
        file = 'image'
    }

    if (file != 'image') {
        let contentType = '';

        switch (req.url) {
            case '/styles.css':
                file = 'styles.css'
                contentType = 'text/css';
                break;

            case '/script.js':
                file = 'script.js'
                contentType = 'text/javascript';
                break;

            case '/manifest.json':
                file = 'manifest.json'
                break;

            case '/service-worker.js':
                file = 'service-worker.js'
                contentType = 'application/javascript'; // or text/javascript or application/x-javascript
                break;

            default:
                file = 'index.html'
                break;
        }

        fs.readFile(file, (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/' + contentType == ''? file.split('.')[1] : contentType })
            res.write(content);
            res.end()
        })
    }
}).listen(8080);

console.log('Serving at http://localhost:8080/')