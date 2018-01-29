'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Services = function () {
    function Services(access_token) {
        _classCallCheck(this, Services);

        this.token = access_token;
        this.api = _axios2.default.create({
            baseURL: 'https://graph.facebook.com/v2.11/',
            timeout: 50000,
            params: {
                access_token: this.token,
                pretty: 0
            }
        });
        this.freshReaction();
    }

    _createClass(Services, [{
        key: 'freshReaction',
        value: function freshReaction() {
            this.reaction = [{
                'react': 'LOVE',
                'count': 0
            }, {
                'react': 'WOW',
                'count': 0
            }, {
                'react': 'HAHA',
                'count': 0
            }, {
                'react': 'SAD',
                'count': 0
            }, {
                'react': 'ANGRY',
                'count': 0
            }];
        }
    }, {
        key: 'delay',
        value: function delay(time) {
            return new Promise(function (res) {
                return setTimeout(function () {
                    return res();
                }, time);
            });
        }
    }, {
        key: 'friends',
        value: async function friends() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'me';

            var request = await this.api.get('/' + id + '?fields=friends.limit(5000){id}');
            return typeof request.data.friends != 'undefined' ? request.data.friends.data : [];
        }
    }, {
        key: 'friendsOfFriend',
        value: async function friendsOfFriend(id) {
            var data = await friends(id);
            return data;
        }
    }, {
        key: 'allFriends',
        value: async function allFriends() {
            var friends = await this.friends();
            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                var getFriends = await this.friends(friend.id);
                friends = Object.assign(friends, getFriends);
                console.log(friends);
            }
            return friends;
        }
    }, {
        key: 'getFriends',
        value: async function getFriends() {
            var request = await this.api.get('/me?fields=friends.limit(5000){id,friends.limit(5000){id,name},name}');
            var friends = [];
            for (var i = 0; i < request.data.friends.data.length; i++) {
                var friend = request.data.friends.data[i];
                typeof friend.friends != 'undefined' ? friends = Object.assign(friends, friend, friend.friends.data) : friends = Object.assign(friends, friend);
            }
            return friends;
        }
    }, {
        key: 'getPosts',
        value: async function getPosts(id_user) {
            var request = await this.api.get('/' + id_user + '?fields=posts.limit(10){id}');
            return typeof request.data.posts != 'undefined' ? request.data.posts.data : [];
        }
    }, {
        key: 'getReaction',
        value: async function getReaction(id_post) {
            var request = await this.api.get('/' + id_post + '?fields=reactions.limit(50)');
            return typeof request.data.reactions != 'undefined' ? request.data.reactions.data : [];
        }
    }, {
        key: 'doReaction',
        value: async function doReaction(id_post, react) {
            try {
                var request = await this.api.post('/' + id_post + '/reactions', { type: react });
                return request.status == 200 ? request.data.success : false;
            } catch (error) {
                return false;
            }
        }
    }, {
        key: 'reactPost',
        value: async function reactPost(posts, name) {
            for (var i = 0; i < posts.length; i++) {
                var post = posts[i];
                var getReactions = await this.getReaction(post.id);
                var countReaction = this.countDuplicates(getReactions);
                await this.delay(500);
                var reaction = await this.doReaction(post.id, countReaction.react);
                if (reaction) console.log(_chalk2.default.green.bold('Bạn đã ') + _chalk2.default.yellow.bold('"Thả thính (' + countReaction.react + ')"') + _chalk2.default.green.bold(' 1 bài viết của: ' + name));
            }
        }
    }, {
        key: 'doPosts',
        value: async function doPosts(friends) {
            for (var i = 0; i < friends.length; i++) {
                var friend = friends[i];
                var getPosts = await this.getPosts(friend.id);
                this.reactPost(getPosts, friend.name);
            }
        }
    }, {
        key: 'countDuplicates',
        value: function countDuplicates(data) {
            for (var i = 0; i < data.length; i++) {
                var reaction = data[i];
                var index = _lodash2.default.findIndex(this.reaction, ['react', reaction.type]);

                index > -1 ? this.reaction[index].count += 1 : false;
            }
            var returnReaction = _lodash2.default.maxBy(this.reaction, 'count');
            this.freshReaction();
            return returnReaction;
        }
    }]);

    return Services;
}();

exports.default = Services;