const users = []

const addUser = ({id, username, room}) => {
    if(!username || !room){
        return {
            error : 'Username and Room name must be required!'
        }
    }
    const user = users.find((user) => {
        return user.username === username
    })

    if(user){
        return {
            error : "You cant use this username"
        }
    }
    const newUser = {id, username, room}
    users.push(newUser)
    return newUser
}

const getUsers = (room) => {
    return users.filter((user) => {
        return user.room === room
    })
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1 ){
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    getUsers,
    removeUser
}