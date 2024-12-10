

const socketEvents = (io) => {
   
      io.on('connection', (socket) => {
        console.log('A user has connected! SocketId: '+socket.id );
    
        socket.on('join-group',(data)=>{
            console.log(data)
          console.log(`User ${data} is mapped to socket ID: ${socket.id}`);
          socket.join(data);
        })
  

        
        socket.on('send-reply',(data)=>{
           console.log(data)

           socket.broadcast.to(data.data.serviceId).emit('incoming-reply',data)
          })
  
       
    
        socket.on('leave', (data) => {
          console.log(data)
          console.log(`User ${data.id} leaving group ${data.groupId}`);
          
          socket.broadcast.to(data.groupId).emit('updated-group',data)
         
        });
  
      
       
        socket.on('disconnect', () => {
          console.log(`SocketId: ${socket.id} has disconnected!`);
        });
  
        
    
       
      });
    };
    
    module.exports = socketEvents;