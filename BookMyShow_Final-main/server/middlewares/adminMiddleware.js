require.exports = function(req , res , next) {
    if(req.body.role === "admin") {
        next();
    }
    else {
        res.status(401).send({ success: false, message: "You are not authorized to access this route!" });
    }
}
