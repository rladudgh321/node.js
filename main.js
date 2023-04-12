const http = require('http');
const fs = require('fs');
const url = require('url');
const template = require('./lib/template');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const sanitize = require('sanitize-html');

const app = http.createServer(function(request,response){
    const queryData = url.parse(request.url,true).query;
    // console.log(url.parse(request.url,true));
    const pathname = url.parse(request.url,true).pathname;
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir(`./data`,function(error,filelist){
                const title = 'WELCOME';
                const data = `node.js !!`;
                const list = template.list(filelist);
                const html = template.HTML(title,list,data,`<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir(`./data`,function(error,filelist){
                const filtered = path.parse(queryData.id).base;
                fs.readFile(`./data/${filtered}`,'utf-8',function(error,data){
                    // console.log(data);
                    const title = filtered;
                    const sanitizedTitle = sanitizeHtml(title);
                    const sanitizedDescription = sanitizeHtml(data,{
                        allowedTags:["h1"]
                    });
                    const list = template.list(filelist);
                    const html = template.HTML(sanitizedTitle,list,sanitizedDescription,`
                        <a href="/create">create</a>
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <p><input type="submit" value="delete"></p>
                        </form>
                    `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create'){
        fs.readdir(`./data`,function(error,filelist){
            const title = 'CREATE';
            const list = template.list(filelist);
            const html = template.HTML(title,list,'',`
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>
            `);
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathname === '/create_process'){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`./data/${title}`,description,'utf-8',function(error){
                response.writeHead(302,{Location:`/?id=${title}`});
                response.end();
            });
        });
    } else if(pathname === '/update'){
        fs.readdir(`./data`,function(error,filelist){
            const filtered = path.parse(queryData.id).base; 
            fs.readFile(`./data/${filtered}`,'utf-8',function(error,data){
                const title = 'UPDATE';
                const list = template.list(filelist);
                const html = template.HTML(title,list,'',`
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <p><input type="text" name="title" placeholder="title" value="${queryData.id}"></p>
                    <p><textarea name="description" placeholder="description">${data}</textarea></p>
                    <p><input type="submit" value="update"></p>
                </form>
                `);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const oldtitle = post.id;
            const newtitle = post.title;
            const description = post.description;
            fs.rename(`./data/${oldtitle}`,`./data/${newtitle}`,function(error1){
                fs.writeFile(`./data/${newtitle}`,description,'utf-8',function(error2){
                    response.writeHead(302,{Location:`/?id=${newtitle}`});
                    response.end();
                 });
            });
        });
    } else if(pathname === '/delete_process'){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const id = post.id;
            const filtered = path.parse(id).base; 
            fs.unlink(`./data/${filtered}`, function(error){
                response.writeHead(302,{Location:`/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('not found');
    } 
    
}).listen(3000);