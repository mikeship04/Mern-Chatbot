import jwt from "jsonwebtoken";
export const createToken = (id, email, expiresIn) => {
    let payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
//# sourceMappingURL=token-manager.js.map