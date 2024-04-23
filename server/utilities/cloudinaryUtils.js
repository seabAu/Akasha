import { v2 as cloudinary } from 'cloudinary';

export const destroy = async( img ) => {
    if ( img ) {
        const imgId = img.split( "/" ).pop().split( "." )[ 0 ];
        await cloudinary.uploader.destroy( imgId );
        return true;
    }
    return false;
}

export const upload = async( img ) => {
    if ( img ) {
        const uploadedResponse = await cloudinary
            .uploader
            .upload( img );
        img = uploadedResponse.secure_url;
        return img;
    }
    return "";
}
