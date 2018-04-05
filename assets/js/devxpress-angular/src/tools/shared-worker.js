let clients = new Array()
let nextId = clients.length
const broadcast = (clients, message) => {
    let length = clients.length
    for (let i = 0; i < length; i++) {
        let port = clients[i]
        port.postMessage(message)
    }
}

self.addEventListener("connect", function (e) {
    let port = e.ports[0]
    nextId++
    clients[nextId].push({id: nextId, port: port})
    port.addEventListener("message", function (e) {
        let data = e.data;

        if (!data.cmd) {
            // how to debug shared workers ?
            console.error('no cmd defined in message')
            return
        }

        if (!data.id) {
            // how to debug shared workers ?
            console.error('no id defined in message')
            return
        }
        const targetClient = clients.find(client => client.id === data.id)
        const otherClients = clients.filter(client => client.id !== data.id)

        switch(data.cmd) {
            case "ping":
                // response only for the caller
                if (targetClient) {
                    data.message = "pong"
                    targetClient.port.postMessage(data)
                } else { // or for all clients if no id found
                    data.message = `unknown client ${data.id}`
                    broadcast(clients, data)
                }
                break
            case "hello":
                // response only for the caller
                if (!otherClients || !otherClients.length) {
                    data.message = "hello: no other clients to say hello"
                    targetClient.port.postMessage(data)
                } else { // or for all clients if no id found
                    data.message = `unknown client ${client.id}`
                    broadcast(otherClients, data)
                }
                break
            default:
                broadcast(clients, data);
                break
        }
    })

    // should we move it at bottom or at top ?
    port.start();

    broadcast(clients, {"id": nextId, "cmd": "connected"});

}, false)
