'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fbLogin = require('./fbLogin');

var _fbLogin2 = _interopRequireDefault(_fbLogin);

var _services = require('./services');

var _services2 = _interopRequireDefault(_services);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async function () {
    try {
        console.log(_chalk2.default.blue.bold('Facebook Reaction') + _chalk2.default.white(' by ') + _chalk2.default.green.underline.bold('GTFAF (fb.me/GTFAF)'));

        var login = await (0, _fbLogin.promptUser)();
        console.log(_chalk2.default.white.bgGreen.bold('Đăng nhập thành công!'));

        var services = new _services2.default(login.access_token);
        var friends = await services.getFriends();
        console.log(_chalk2.default.bgCyan.white.bold('Lấy danh sách bạn bè và bạn của bạn bè...'));
        console.log(_chalk2.default.bgBlueBright.white('Bắt đầu "Thả thính" tới bạn bè...'));
        await services.doPosts(friends);
    } catch (error) {
        console.log(error);
    }
})();