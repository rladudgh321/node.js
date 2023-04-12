const db = require('../db/db');
const path = require('path');
const url = require('url');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const qs = require('querystring');

module.exports = {
    home: function(request,response){
        db.query(`SELECT * FROM topic`, function(error,topics){
            // console.log(topics.title);
            const title = 'WELCOME';
            const data = `node.js !!`;
            const list = template.list(topics);
            const html = template.HTML(title,list,data,`<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
    },
    page: function(request,response){
        const queryData = url.parse(request.url,true).query;
        db.query(`SELECT * FROM topic`, function(error,topics){
            const filtered = path.parse(queryData.id).base;
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id =?`,[queryData.id],function(error,topic){
                // console.log(topic[0].title);
                const title = topic[0].title;
                const sanitizedTitle = sanitizeHtml(title);
                const sanitizedDescription = sanitizeHtml(topic[0].description,{
                    allowedTags:["h1"]
                });
                const list = template.list(topics);
                const html = template.HTML(sanitizedTitle,list,sanitizedDescription,`
                    <p>by ${topic[0].name}</p>
                    <a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <p><input type="submit" value="delete"></p>
                    </form>
                `);
                response.writeHead(200);
                response.end(html);
            });
        });
    },
    create: function(request,response){
        db.query(`SELECT * FROM topic`, function(error,topics){
            db.query(`SELECT * FROM author`, function(error2, authors){
                const title = 'CREATE';
                const list = template.list(topics);
                const form = template.select_form(authors);
                const html = template.HTML(title,list,'',`
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    ${form}
                    <p><input type="submit" value="create"></p>
                </form>
                `);
                response.writeHead(200);
                response.end(html);
            });
        });
    },
    create_process: function(request,response){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            const author_id = post.author_id;
            db.query(`INSERT INTO topic(title,description,created,author_id)
            VALUES(?,?,NOW(),?)`,[title,description,author_id],function(error, result){
                console.log(result);
                response.writeHead(302,{Location:`/?id=${result.insertId}`});
                response.end();
            });
        });
    },
    update: function(request,response){
        const queryData = url.parse(request.url,true).query;
        db.query(`SELECT * FROM topic`, function(error,topics){
            const filtered = path.parse(queryData.id).base; 
            db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id],function(error,topic){
                db.query(`SELECT * FROM author`, function(error2, authors){
                    console.log(topic[0].author_id);
                    const title = 'UPDATE';
                    const list = template.list(topics);
                    const form = template.select_form(authors,topic[0].author_id);
                    const html = template.HTML(title,list,'',`
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                        <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
                        ${form}
                        <p><input type="submit" value="update"></p>
                    </form>
                    `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
    },
    update_process: function(request,response){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const oldtitle = post.id;
            const newtitle = post.title;
            const description = post.description;
            const author_id = post.author_id;
            db.query(`UPDATE topic SET
            title =?,
            description =?,
            author_id=?
            WHERE id =?`,[newtitle, description, author_id, oldtitle],function(error, result){
                response.writeHead(302,{Location:`/?id=${oldtitle}`});
                response.end();
            });
        });
    },
    delete_process: function(request,response){
        let body='';
        request.on('data', function(data){
            body += data; 
        });
        request.on('end', function(){
            const post = qs.parse(body);
            const id = post.id;
            const filtered = path.parse(id).base; 
            db.query(`DELETE FROM topic WHERE id = ?`,[id],function(error,result){
                response.writeHead(302,{Location:`/`});
                response.end();
            });
        });
    }
}