const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BCGA6qicb9R29323Sou0DqI-KSU4MQOKoxoBx4OBgFyQAF2J1jCRRW6oSc1dDy3dxEWlfnLs1tW55ZTuIY5JHU8",
    "privateKey": "TmDvZWHcSVpGzuXPH_dfypgyn2FnlBXK55w6Mt4ruE0"
};
 
 
webPush.setVapidDetails(
    'mailto:triabi139@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fFdTfpyaGj0:APA91bG6-duFOPhRF2wozRI7GlgeCr3yvD5IXA54p6LYcugFNb-d2LWa-TpDBKbe--CbiUn4Ti3I3ewLfGn3fzxnCLlw1gES7ufiGAgvKXCLLIWesUcov7wY96ckwZVUEwxziAByMQGB",
    "keys": {
        "p256dh": "BNyuRx3akRFc/ktZr5WPLcgvqc8LeHyaEkTplgTaEvDX+j0CBxnJjSYlXl/MQ0EX5Za34dWLJTEt16vNkDKxlFI=",
        "auth": "j58mjOnc8m7pSruwTjpd/w=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
const options = {
    gcmAPIKey: '489407451958',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);