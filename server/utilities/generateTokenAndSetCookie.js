import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = ( userId, res ) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    );

    res.cookie( "jwt", token, {
        httpOnly: true, // Not accessible via javascript or by the browser.
        maxAge: new Date( Date.now() + 15 * 24 * 60 * 60 * 1000 ), // 15 days
        sameSite: "strict", // CSRF
    } );

    return token;
}
