import jwt from 'jsonwebtoken'

export function authuser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token Provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.jwtsecret)
        req.user = decoded,
            next()
    } catch (err) {
        res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid user"
        })
    }
}