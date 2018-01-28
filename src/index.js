import fbLogin from './fbLogin'
import Services from './services'
import fs from 'fs'

(async () => {
    try {
        let services = new Services('EAAAAUaZA8jlABAOGRG27EFV5kTAbG8qn7gcwUwIeml5SWcd99cjZAS45yNuO9oPjM8gYUGshTOYFoWYYKElkCQEWkwNM7vIGd4iwC3ZCYOudH1tQQcfXEI3hVpfNgeTWS9SBpmAjnkE5SRBl4MkKgfIi6KeA0J9CudaxZBJG7n1OprXbp4T6')
        // let friends = await services.getFriends()
        let getPosts = await services.getPosts('165883730494067')
        for (let i = 0; i < getPosts.length; i++) {
            const post = getPosts[i];
            let reaction = await services.reaction(post.id, 'LOVE')
        }
    } catch (error) {
        console.log(error)
    }
})()