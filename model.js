const low = require('lowdb');
const shortId = require('shortid');
const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('./model/db.json');  // 开发时请使用这个
const adapter = new FileSync('./resources/app/model/db.json'); // 打包的时候请使用这个
const db = low(adapter);


function initDatabase() {
    // 初始化数据库
    db.defaults({data: [], user: {}})
        .write();
}

function loginCheck() {
    let PIN = $('#loginPIN').val();
    let pwd = db.get('user')
        .value();
    if (PIN === window.atob(pwd.key)) {
        $("#myModal").modal('hide');
    } else {
        $('#errorInfo').show();
        $('#loginPIN').val('');
    }
}


function getDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate()
    return `${year}年${month}月${date}日`;
}


function cardTemplate(id, title, password, color, time) {
    let template = `<div class="card text-white ${color}" id="${id}">
                        <div class="card-body">
                            <a>${time}</a>&emsp;&emsp;
                            ${title}
                            <a hidden id="pwd">${password}</a>
                            <span style="float: right">
                                <a href="#"  onclick="turnOn(this)" id="${password}"><i class="fa fa-eye fa-lg" style="color: #FFFFF0"></i></a>&emsp;
<!--                                <a href="#"  onclick="Modify(this)" id="M${id}"><i class="fa fa-pencil fa-lg" style="color: #FFFFF0"></i></a>&emsp;-->
                                <a href="#"  onclick="Remove(this)" id="R${id}"><i class="fa fa-trash fa-lg" style="color: #FFFFF0"></i></a>
                            </span>
                        </div>
                    </div>`;
    return template;
}


function getAllData() {
    let contentArea = document.getElementById('contentArea');
    let template = '';
    let data = db.get('data')
        .value();
    if (data.length === 0) {
        template = `<div style="text-align: center" id="emptyTag">
                        <img src="./static/images/logo/empty.png" alt="什么都没有，添加点神马吧">
                        <p></p>
                        <p>神马都没有... 点击菜单添加点内容吧</p>
                    </div>`;
        contentArea.innerHTML = template;
    } else {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let pwd = window.atob(data[i].password);
                template += cardTemplate(data[i].id, data[i].userCount, pwd, data[i].colorTag, data[i].dateTime)
            }
            contentArea.innerHTML = template;
        }
    }
}


function Add() {
    let userCount = document.getElementById('userCount');
    let userPassword = document.getElementById('userPassword');
    let encryptPassword = window.btoa(userPassword.value);
    let colorTag = document.getElementById('colorTag');
    let dateTime = getDate();
    let contentArea = document.getElementById('contentArea');
    let id = shortId.generate();

    let empty = document.getElementById('emptyTag');
    if (empty){
        contentArea.removeChild(empty);
    }

    db.get('data')
        .push({
            id: id,
            userCount: userCount.value,
            password: encryptPassword,
            colorTag: colorTag.value,
            dateTime: dateTime
        })
        .write();

    let div = document.createElement('div');
    div.id = id;
    div.className = `card text-white ${colorTag.value}`;
    let childDiVHtml = `<div class="card-body">
                            <a>${dateTime}</a>&emsp;&emsp;
                            ${userCount.value}
                            <span style="float: right">
                                <a href="#"  onclick="turnOn(this)" id="${userPassword.value}"><i class="fa fa-eye fa-lg" style="color: #FFFFF0"></i></a>&emsp;
<!--                                <a href="#"  onclick="Modify(this)" id="M${id}"><i class="fa fa-pencil fa-lg" style="color: #FFFFF0"></i></a>&emsp;-->
                                <a href="#"  onclick="Remove(this)" id="R${id}"><i class="fa fa-trash fa-lg" style="color: #FFFFF0"></i></a>
                            </span>
                        </div>`;
    div.innerHTML = childDiVHtml;
    contentArea.appendChild(div);

    userCount.value = null;
    userPassword.value = null;
    colorTag.value = null;
}


function Remove(event) {
    let id = event.id.substr(1);
    let contentArea = document.getElementById('contentArea');
    let elem = document.getElementById(id);
    db.get('data')
        .remove({id: id})
        .write();

    contentArea.removeChild(elem);
    if (contentArea.childElementCount === 0) {
        let template = `<div style="text-align: center" id="emptyTag">
                        <img src="./static/images/logo/empty.png" alt="什么都没有，添加点神马吧">
                        <p></p>
                        <p>神马都没有... 点击菜单添加点内容吧</p>
                    </div>`;
        contentArea.innerHTML = template;
    }
}


function Modify(event) {
    let userCount = document.getElementById('modifyCount');
    let userPassword = document.getElementById('modifyPwd');
    let colorTag = document.getElementById('modifyColorTag');
    let transferId = document.getElementById('transferId');
    let id = event.id.substr(1);
    let originData = db.get('data')
        .find({id: id})
        .value();

    userCount.value = originData.userCount;
    userPassword.value = window.atob(originData.password);
    colorTag.value = originData.colorTag;
    transferId.value = id;

    $('#modifyInfoModal').modal('show');
    // let encryptPassword = window.btoa(userPassword.value);
    //

}


function doModify() {
    let userCount = document.getElementById('modifyCount');
    let userPassword = document.getElementById('modifyPwd');
    let colorTag = document.getElementById('modifyColorTag');
    let id = document.getElementById('transferId');
    let dateTime = getDate();

    db.get('data')
        .find({id: id})
        .assign({
            userCount: userCount.value,
            password: window.btoa(userPassword.value),
            colorTag: colorTag.value,
            dateTime: dateTime
        })
        .write();


}


function modifyPassword() {
    // 修改用户密码
    let newPassword = document.getElementById('modifyPassword');
    let encryptPassword = window.btoa(newPassword.value);
    db.unset('user.key')
        .write();
    db.set('user.key', encryptPassword)
        .write();
}


function turnOn(event) {
    let pwd = event.id;
    $('#pwdText').text(pwd);
    $('#turnOnModal').modal('show');
}

