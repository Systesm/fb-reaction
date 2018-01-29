import chalk from 'chalk'
import fbLogin, { promptUser } from './fbLogin'
import Services from './services'

(async () => {
    try {
        console.log(chalk.blue.bold('Facebook Reaction') + chalk.white(' by ') + chalk.green.underline.bold('GTFAF (fb.me/GTFAF)'));

        let login = await promptUser()
        console.log(chalk.white.bgGreen.bold('Đăng nhập thành công!'))

        let services = new Services(login.access_token)
        let friends = await services.getFriends()
        console.log(chalk.bgCyan.white.bold('Lấy danh sách bạn bè và bạn của bạn bè...'))
        console.log(chalk.bgBlueBright.white('Bắt đầu "Thả thính" tới bạn bè...'))
        await services.doPosts(friends)

    } catch (error) {
        console.log(error)
    }
})()