const publishOrder = async (req, res, next) => {
    const {orderInfo} = req.body;
    req.orderInfo = orderInfo;
    next();
}

export {publishOrder};