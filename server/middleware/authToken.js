import jwt from "jsonwebtoken";
const debug = false;

// For any routes we want to be private, such as admin-only routing functionality in the backend like add or remove or edit users, then we use this to confirm that the user is logged in and authorized.
const authToken = async (req, res, next) => {
    // Fetch the token from the header.
    const token = req.header("x-auth-token");
    // Check for token.
    if (!token) {
        return res.status(401).send({
            data: token,
            success: false,
            message: "No Token, authorization denied.",
        });
    }

    try {
        // Token was defined / not null; verify it.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload.
        req.user = decoded;
        res.status = 200;
        next();
    } catch (e) {
        return res.status(400).send({
            data: e,
            success: false,
            status: 400,
            message: "Invalid Token",
        });
    }
}

export default authToken;
