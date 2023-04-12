const db = require('../db/db');
const template = require('../lib/template');
const qs = require('querystring');
const url = require('url');
const sanitizeHtml = require('sanitize-html');

module.exports = {
    home: function(request,response){
        db.query(`SELECT * FROM topic`, function(error,topics){
            db.query(`SELECT * FROM author`, function(error2, authors){
                const queryData = url.parse(request.url,true).query;
                    // console.log(author);
                    const title = 'AUTHOR';
                    const data =  template.authorlist(authors);
                    const list = template.list(topics);
                    const html = template.HTML(title,list,data,`
                    <h2>CREATE AUTHOR</h2>
                    <form action="/create_author_process" method="post">
                        <p><input type="text" name="name" placeholder="name"></p>
                        <p><textarea name="profile" placeholder="profile"></textarea></p>
                        <p><input type="submit" value="create_author"></p>
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
            const name = post.name;
            const profile = post.profile;
            db.query(`INSERT INTO author(name,profile)
            VALUES(?,?)`,[name,profile],function(error, result){
                response.writeHead(302,{Location:`/author`});
                response.end();
            });
        });
    },
    update: function(request,response){
        db.query(`SELECT * FROM topic`, function(error,topics){
            db.query(`SELECT * FROM author`, function(error2, authors){
                const queryData = url.parse(request.url,true).query;
                db.query(`SELECT * FROM author WHERE id =?`,[queryData.id], function(error3, author){
                    // console.log(author);
                    const title = 'AUTHOR';
                    const data =  template.authorlist(authors);
                    const list = template.list(topics);
                    const html = template.HTML(title,list,data,`
                    <h2>UPDATE AUTHOR</h2>
                    <form action="/update_author_process" method="post">
                        <input type="hidden" name="id" value="${author[0].id}">
                        <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                        <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                        <p><input type="submit" value="update_author"></p>
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
            const id = post.id
            const name = post.name;
            const profile = post.profile;
            db.query(`UPDATE author SET
                name = ?,
                profile =?
                WHERE id = ?
            `,[name,profile,id],function(error, result){
                response.writeHead(302,{Location:`/author`});
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
            const id = post.id
            db.query(`DELETE FROM topic WHERE author_id=?`,[id], function(error1, result1){
                db.query(`DELETE FROM author WHERE id = ?`, [id], function(error, result){
                    response.writeHead(302,{Location:`/author`});
                    response.end();
                });
            });
        });
    }

}