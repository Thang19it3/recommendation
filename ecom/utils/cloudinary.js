const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: 'dsbyw4m4l',
    api_key: '518572253412566',
    api_secret: 'L1_RxO1LWnPnIJRNR5-vzIvHJLo'
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
};

module.exports = {
    cloudinaryUploadImg,
    cloudinaryDeleteImg
};