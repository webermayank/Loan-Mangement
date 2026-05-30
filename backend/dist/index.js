"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const borrower_routes_1 = __importDefault(require("./routes/borrower.routes"));
const ops_routes_1 = __importDefault(require("./routes/ops.routes"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
const uploadDir = path_1.default.join(__dirname, '../uploads');
fs_1.default.mkdirSync(uploadDir, { recursive: true });
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(uploadDir));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/borrower', borrower_routes_1.default);
app.use('/api/ops', ops_routes_1.default);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
});
exports.default = app;
