module.exports = {
    list : function alist(filelist){
        let list = '';
        for(let i=0;i<filelist.length;i++){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        return list;
    }
}