const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {

    if(req.url === '/'){
        fs.readFile(path.join(__dirname, '..', 'assignment1', '1.html'),(err, content) => {
                                    
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        })
        
        
    }else if (req.url === '/api'){

        fs.readFile(path.join(__dirname, '..', 'assignment1', 'data.json'),(err,content)=>{
            if(err) throw err;
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(content);
        })
        
    }
})

const PORT= process.env.PORT || 5959;


server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));