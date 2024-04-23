const status = ( status, message ) => {
    return res.status( status ).json( { message: message } );
}
