import { WebSocketServer, WebSocket } from "ws";

const wss=new WebSocketServer({port: 8080});

type User={
    socket: WebSocket;
    room: string;
}

let allSockets:User[]=[];
const userMap=new Map<WebSocket, string>()

wss.on("connection", (socket)=>{

    socket.on("message", (message)=>{
        //@ts-ignore
        const parsedMessage=JSON.parse(message);
        if (parsedMessage.type=="join"){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type=="chat"){
            // const currenUserRoom=allSockets.find((x)=>x.socket==socket).room
            let currenUserRoom=null;
            for(let i=0; i<allSockets.length; i++){
                if (allSockets[i].socket==socket){
                    currenUserRoom=allSockets[i].room;
                }
            }
            for(let i=0; i<allSockets.length; i++){
                if (allSockets[i].room==currenUserRoom){
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
    })
})