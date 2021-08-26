exports.success = function (req, res, message, status = 200) {
    res.status(status).send({
        error: false,
        status: status,
        message: message
    })
}

exports.error = function(req, res, message = "Internal Server Error", status = 200) {
    res.status(status).send({
        error: true,
        status: status,
        message: message
    })
}