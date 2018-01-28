import crypto from 'crypto'
import axios from 'axios'
import chalk from 'chalk'
import _ from 'lodash'

class Services {

    constructor (access_token) {
        this.token = access_token
        this.api = axios.create({
            baseURL: 'https://graph.facebook.com/v2.11/',
            timeout: 10000,
            params: {
                access_token: this.token
            }
        })
    }

    async friends (id = 'me') {
        let request = await this.api.get('/'+id+'?fields=friends.limit(5000){id}&pretty=0')
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
            let friend = friends[i];
            let getFriends = await this.friends(friend.id)
            friends = Object.assign(friends, getFriends)
            console.log(friends)
        }
        return friends
    }

    async getFriends () {
        let request = await this.api.get('/me?fields=friends.limit(5000){id,friends.limit(5000){id}}')
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
        let request = await this.api.get('/' + id_user + '?fields=posts{id}')
        return typeof request.data.posts != 'undefined' ?
                        request.data.posts.data :
                        []
    }

    async reaction (id_post, react) {
        let request = await this.api.post('/' + id_post + '/reactions', { type: react })
        return request.data.success
    }
}

export default Services