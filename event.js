const remote = require('electron').remote;

function logout() {
    const curWindow = remote.getCurrentWindow();
    $('#myModal').modal('hide');
    curWindow.close();
}


function Click2Minus() {
    // 登录界面最小化
    const curWin = remote.getCurrentWindow();
    curWin.minimize();
}