const sanitizeHtml = require('sanitize-html');
module.exports = {
    list : function(filelist){
        let list = '';
        for(let i=0;i<filelist.length;i++){
            list += `<li><a href="/?id=${filelist[i].id}">${sanitizeHtml(filelist[i].title)}</a></li>`;
        }
        return list;
    },
    HTML : function(title, list, data, control){
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="data:,">
                <title>${title}</title>
            </head>
            <body>
                <h1><a href="/">web</a></h1>
                <a href="/author">author</a>
                <ol>
                    ${list}
                </ol>
                <h2>${title}</h2>
                <p>${data}</p>
                ${control}
            </body>
            </html>
            `;
    },
    authorlist: function(authors){
        let authorlist = `<table border="1">
            <tr>
                <td>id</td>
                <td>name</td>
                <td>profile</td>
                <td>update</td>
                <td>delete</td>
            </tr><tr>`;
        for(let i=0; i<authors.length;i++){
            authorlist += `<td>${sanitizeHtml(authors[i].id)}</td>
                            <td>${sanitizeHtml(authors[i].name)}</td>
                            <td>${sanitizeHtml(authors[i].profile)}</td>
                            <td><a href="/update_author?id=${authors[i].id}">update</a></td>
                            <td>
                                <form action="/delete_author_process" method="post">
                                    <input type="hidden" name="id" value="${authors[i].id}">
                                    <input type="submit" value="delete">
                                </form>
                            </td>
                            </tr>`;
                            
        }
        authorlist += `</table>`
        return authorlist;
    },
    select_form: function (authors,author_id){
        let form = '<select name="author_id">';
        let selected = '';
        for(let i=0;i<authors.length;i++){
            if(authors[i].id === author_id){
                selected = ' selected';
            }else{
                selected = ``;
            }
            form += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`; 
        }
        form += `</select>`;
        return form;
    }
}