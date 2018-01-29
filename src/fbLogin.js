import crypto from "crypto"
import axios from "axios"
import chalk from 'chalk'
import Input from "prompt-input"
import Password from "prompt-password"
import _ from "lodash"

const API_KEY = "882a8490361da98702bf97a021ddc14d"
const API_SECRET = "62f8ce9f74b12f84c123cc23437a4a32"
const BASE_URL = "https://api.facebook.com/restserver.php"
const HEADERS = {
    "User-Agent": "[FBAN/FB4A;FBAV/1.9.9;FBDM/{density=1.33125,width=800,height=1205};FBLC/en_US;FBCR/;FBPN/com.facebook.katana;FBDV/Nexus 7;FBSV/4.1.1;FBBK/0;]",
    "Content-Type": "application/json"
}

let DATA = {
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
}

let ObjectToParams = data => {
    return Object.keys(data).map(function (k) {
        return k + '=' + data[k]
    }).join('')
}

let getCookie = cookies => {
    return Object.keys(cookies).map(k => {
        return cookies[k].name + '=' + cookies[k].value
    }).join(';')
}

let login = async (email, password) => {

    DATA.email = email
    DATA.password = password

    let sortData = _(DATA).toPairs().sortBy(0).fromPairs().value()
    let sumQueryToParams = ObjectToParams(sortData)
    sumQueryToParams = sumQueryToParams + API_SECRET
    let hashMd5Query = crypto.createHash('md5').update(sumQueryToParams, 'utf8').digest("hex")
    sortData.sig = hashMd5Query

    let request = await axios({
        url: BASE_URL,
        method: 'POST',
        headers: HEADERS,
        data: JSON.stringify(sortData),
        withCredentials: true
    })

    if (request.data.hasOwnProperty('error_msg'))
        throw chalk.bold.bgRed.white('Có lỗi xảy ra: fbLogin() - ' + request.data.error_msg)

    let cookies = getCookie(request.data.session_cookies)

    return {
        access_token: request.data.access_token,
        cookies: cookies
    }
}

let promptUser = async () => {

    let username = await new Input({
        name: 'username',
        message: 'Nhập tài khoản của bạn'
    }).run()

    let password = await new Password({
        type: 'password',
        message: 'Nhập mật khẩu của bạn',
        name: 'password'
    }).run()

    if (typeof username == 'undefined' ||
        username.length < 5 ||
        typeof password == 'undefined' ||
        password.length < 5)
        throw chalk.bgRed.white.bold('Tài khoản hoặc mật khẩu vui lòng nhập hơn 5 ký tự')

    return await login(username, password)
}


export { getCookie, promptUser }
export default login