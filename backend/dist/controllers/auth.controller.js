"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
function signToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || '', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}
function sendToken(res, id) {
    const token = signToken(id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
const register = async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const { name, email, password } = parsed.data;
    const existing = await User_1.default.findOne({ email });
    if (existing) {
        res.status(409).json({ message: 'Email already registered' });
        return;
    }
    const user = await User_1.default.create({ name, email, password, role: 'borrower' });
    sendToken(res, user.id);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
exports.register = register;
const login = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const { email, password } = parsed.data;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }
    sendToken(res, user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
exports.login = login;
const logout = (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    res.json({ user: req.user });
};
exports.getMe = getMe;
