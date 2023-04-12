module.exports = {
    list : function(filelist){
        let list = '';
        for(let i=0;i<filelist.length;i++){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
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
                <ol>
                    ${list}
                </ol>
                <h2>${title}</h2>
                <p>${data}</p>
                ${control}
            </body>
            </html>
            `;
    }
}