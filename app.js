var express = require("express");
const res = require("express/lib/response");
var app =express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(2023);
var mangUser = [];
io.on("connection",function(socket){
    console.log("co nguoi ket noi "+socket.id);
    socket.on("disconnect",function(){
        console.log(socket.id +" ngat ket noi");
    });
    socket.on('client-send-user',function(data){
        console.log(socket.id +"vua gui " +data);
        io.sockets.emit("server-send-data", data+"888");
        if(mangUser.indexOf(data)>=0){
            socket.emit('server-send-fail');
        }
        else{
            mangUser.push(data);
            socket.emit('server-send-success',data);
            socket.username =data;
            io.sockets.emit('server-send-list-user',mangUser);
        }
        socket.on('logOut',function(){
            mangUser.splice(mangUser.indexOf(data),1);
            socket.broadcast.emit("server-send-list-user",mangUser);
        });
        socket.on('user-send-mess',function(data){
            io.sockets.emit('server-send-mess',{username:socket.username,nd:data});
            console.log(data.username + data.nd);
        });
        socket.on('typing',()=>{
            var s= socket.username + " typing...";
            io.sockets.emit('someone-typing',s);
        });
        socket.on('stop-typing',()=>{
            io.sockets.emit('someone-stop-typing');
        });
    });
    
});

app.get("/", function(req,res){
    res.render("index")
})