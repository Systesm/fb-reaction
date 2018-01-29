"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.promptUser = exports.getCookie = undefined;

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _promptInput = require("prompt-input");

var _promptInput2 = _interopRequireDefault(_promptInput);

var _promptPassword = require("prompt-password");

var _promptPassword2 = _interopRequireDefault(_promptPassword);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_KEY = "882a8490361da98702bf97a021ddc14d";
var API_SECRET = "62f8ce9f74b12f84c123cc23437a4a32";
var BASE_URL = "https://api.facebook.com/restserver.php";
var HEADERS = {
    "User-Agent": "[FBAN/FB4A;FBAV/1.9.9;FBDM/{density=1.33125,width=800,height=1205};FBLC/en_US;FBCR/;FBPN/com.facebook.katana;FBDV/Nexus 7;FBSV/4.1.1;FBBK/0;]",
    "Content-Type": "application/json"
};

var DATA = {
    "generate_machine_id": 1,
    "credentials_type": "password",
    "method": "auth.login",
    "api_key": API_KEY,
    "format": "JSON",
    "generate_session_cookies": 1,
    "locale": "en_US",
    "migrations_override": "{'empty_json':true}",
    "return_ssl_resources": 0,
    "v": "1.0"
};

var ObjectToParams = function ObjectToParams(data) {
    return Object.keys(data).map(function (k) {
        return k + '=' + data[k];
    }).join('');
};

var getCookie = function getCookie(cookies) {
    return Object.keys(cookies).map(function (k) {
        return cookies[k].name + '=' + cookies[k].value;
    }).join(';');
};

var login = async function login(email, password) {

    DATA.email = email;
    DATA.password = password;

    var sortData = (0, _lodash2.default)(DATA).toPairs().sortBy(0).fromPairs().value();
    var sumQueryToParams = ObjectToParams(sortData);
    sumQueryToParams = sumQueryToParams + API_SECRET;
    var hashMd5Query = _crypto2.default.createHash('md5').update(sumQueryToParams, 'utf8').digest("hex");
    sortData.sig = hashMd5Query;

    var request = await (0, _axios2.default)({
        url: BASE_URL,
        method: 'POST',
        headers: HEADERS,
        data: JSON.stringify(sortData),
        withCredentials: true
    });

    if (request.data.hasOwnProperty('error_msg')) throw _chalk2.default.bold.bgRed.white('Có lỗi xảy ra: fbLogin() - ' + request.data.error_msg);

    var cookies = getCookie(request.data.session_cookies);

    return {
        access_token: request.data.access_token,
        cookies: cookies
    };
};

var promptUser = async function promptUser() {

    var username = await new _promptInput2.default({
        name: 'username',
        message: 'Nhập tài khoản của bạn'
    }).run();

    var password = await new _promptPassword2.default({
        type: 'password',
        message: 'Nhập mật khẩu của bạn',
        name: 'password'
    }).run();

    if (typeof username == 'undefined' || username.length < 5 || typeof password == 'undefined' || password.length < 5) throw _chalk2.default.bgRed.white.bold('Tài khoản hoặc mật khẩu vui lòng nhập hơn 5 ký tự');

    return await login(username, password);
};

exports.getCookie = getCookie;
exports.promptUser = promptUser;
exports.default = login;