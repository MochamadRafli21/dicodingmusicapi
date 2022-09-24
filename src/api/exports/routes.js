
const routes = (handler)=>[
    {
        "method": "POST",
        "path": "/export/playlists/{id}",
        "handler": handler.postExportsPlaylistHandler,
        "options":{
            "auth":"jwt"
        }
    },
]
module.exports = routes