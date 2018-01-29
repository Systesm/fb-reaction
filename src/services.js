import crypto from 'crypto'
import axios from 'axios'
import chalk from 'chalk'
import _ from 'lodash'

class Services {

    constructor (access_token) {
        this.token = access_token
        this.api = axios.create({
            baseURL: 'https://graph.facebook.com/v2.11/',
            timeout: 50000,
            params: {
                access_token: this.token,
                pretty: 0
            }
        })
        this.freshReaction()
    }

    freshReaction () {
        this.reaction = [
            {
                'react': 'LOVE',
                'count': 0
            },
            {
                'react': 'WOW',
                'count': 0
            },
            {
                'react': 'HAHA',
                'count': 0
            },
            {
                'react': 'SAD',
                'count': 0
            },
            {
                'react': 'ANGRY',
                'count': 0
            }
        ]
    }

    delay (time) {
        return new Promise(res => setTimeout(() => res(), time))
    }

    async friends (id = 'me') {
        let request = await this.api.get('/'+id+'?fields=friends.limit(5000){id}')
        return typeof request.data.friends != 'undefined' ?
                request.data.friends.data :
                []
    }

    async friendsOfFriend (id) {
        let data = await friends(id)
        return data
    }

    async allFriends () {
        let friends = await this.friends()
        for (let i = 0; i < friends.length; i++) {
            let friend = friends[i]
            let getFriends = await this.friends(friend.id)
            friends = Object.assign(friends, getFriends)
            console.log(friends)
        }
        return friends
    }

    async getFriends () {
        let request = await this.api.get('/me?fields=friends.limit(5000){id,friends.limit(5000){id,name},name}')
        let friends = []
        for (let i = 0; i < request.data.friends.data.length; i++) {
            let friend = request.data.friends.data[i]
            typeof friend.friends != 'undefined' ?
                friends = Object.assign(friends, friend, friend.friends.data) :
                friends = Object.assign(friends, friend)
        }
        return friends
    }

    async getPosts (id_user) {
        let request = await this.api.get('/' + id_user + '?fields=posts.limit(10){id}')
        return typeof request.data.posts != 'undefined' ?
                        request.data.posts.data :
                        []
    }

    async getReaction (id_post) {
        let request = await this.api.get('/' + id_post + '?fields=reactions.limit(50)')
        return typeof request.data.reactions != 'undefined' ?
                        request.data.reactions.data :
                        []
    }

    async doReaction (id_post, react) {
        try {
            let request = await this.api.post('/' + id_post + '/reactions', { type: react })
            return request.status == 200 ?
                request.data.success :
                false
        } catch (error) {
            return false
        }
    }

    async reactPost (posts, name) {
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i]
            let getReactions = await this.getReaction(post.id)
            let countReaction = this.countDuplicates(getReactions)
            await this.delay(500)
            let reaction = await this.doReaction(post.id, countReaction.react)
            if (reaction)
                console.log(chalk.green.bold('Bạn đã ') + chalk.yellow.bold('"Thả thính (' + countReaction.react + ')"') + chalk.green.bold(' 1 bài viết của: ' + name))
        }
    }

    async doPosts (friends) {
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i]
            let getPosts = await this.getPosts(friend.id)
            this.reactPost(getPosts, friend.name)
        }
    }

    countDuplicates (data) {
        for (let i = 0; i < data.length; i++) {
            const reaction = data[i]
            let index = _.findIndex(this.reaction, ['react', reaction.type])

            index > -1 ?
                this.reaction[index].count += 1 :
                false
        }
        let returnReaction = _.maxBy(this.reaction, 'count')
        this.freshReaction()
        return returnReaction
    }
}

export default Services
