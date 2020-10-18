const imageMimeType = ["image/jpeg", "image/png", "image/gif"]

function saveImage(item, imageEncoded) {
    if (imageEncoded === null ) return
    const image = JSON.parse(imageEncoded);
    if (image !== null && imageMimeType.includes(image.type)) {
        item.productImg = new Buffer.from(image.data, "base64");
        item.productImgType = image.type
    }
}

module.exports = {
    saveImage
}