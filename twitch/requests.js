const https = require('https')
const config = require('../config/config')

const clientId = config.twitchSettings().clientId;
const streamerOAuthSettings = config.twitchSettings().streamerOAuth

let StreamOAuthURL = 
    'https://id.twitch.tv/oauth2/authorize' + 
    '?client_id=' + clientId +
    '&redirect_uri=' + streamerOAuthSettings.redirect +
    '&response_type=' + streamerOAuthSettings.response_type + 
    '&scope=' + streamerOAuthSettings.scope.join('%20') +
    '&force_verify=true'


module.exports = {
    createClientToken: () => {
        return new Promise((resolve, reject) => {
            const reqData = JSON.stringify({
                client_id: '7ut0fk3wl2mgi8egrnq5yhy4fkmebh',
                client_secret: process.env.TROLL_FILTER_SECRET,
                grant_type: 'client_credentials'
            })
            
            const reqOptions = {
                hostname: 'id.twitch.tv',
                port: 443,
                path: '/oauth2/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': reqData.length
                }
            }
            
            let rawData = ''
            
            const req = https.request(reqOptions, res => {
            
                res.on('data', data => {
                    rawData += data
                })
            
                res.on('end', () => {
                    resolve({
                        token: JSON.parse(rawData).access_token,
                        OAuthURL: StreamOAuthURL + '&state=' + JSON.parse(rawData).access_token
                    })
                })
            })
            
            req.on('error', err => {
                reject(err)
            })
            
            req.write(reqData)
            req.end()
        })

    },

    createStreamerToken: code => {
        return new Promise((resolve, reject) => {
            const reqData = JSON.stringify({
                client_id: '7ut0fk3wl2mgi8egrnq5yhy4fkmebh',
                client_secret: process.env.TROLL_FILTER_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: streamerOAuthSettings.redirect
            })

            const reqOptions = {
                hostname: 'id.twitch.tv',
                port: 443,
                path: '/oauth2/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': reqData.length
                }
            }

            let rawData = ''

            const req = https.request(reqOptions, res => {
                res.on('data', data => {
                    rawData += data
                })

                res.on('end', () => {
                    resolve(JSON.parse(rawData))
                })
            })

            req.on('error', err => {
                reject(err)
            })
            
            req.write(reqData)
            req.end()

        })

    },

    validateToken: token => {
        return new Promise((resolve, reject) => {

            const reqOptions = {
                hostname: 'id.twitch.tv',
                port: 443,
                path: '/oauth2/validate',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "OAuth " + token
                }
            }

            let rawData = ''

            const req = https.request(reqOptions, res => {
                res.on('data', data => {
                    rawData += data
                })

                res.on('end', () => {
                    resolve(JSON.parse(rawData))
                })
            })

            req.on('error', err => {
                reject(err)
            })
            
            req.end()

        })

    }

}