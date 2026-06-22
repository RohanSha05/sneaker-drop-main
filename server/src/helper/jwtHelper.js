import jwt from "jsonwebtoken"


const generateToken = (payload, secret, expiresIn ) => {
    const token = jwt.sign(payload, secret, {
        algorithm:"HS256",
        expiresIn
    } 
)

return token
}


export const jwtHelper = {
    generateToken
}