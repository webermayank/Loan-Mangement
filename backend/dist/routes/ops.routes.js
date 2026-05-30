"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ops_controller_1 = require("../controllers/ops.controller");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
// Sales
router.get('/leads', (0, auth_1.authorize)('sales', 'admin'), ops_controller_1.getLeads);
// Sanction
router.get('/sanction', (0, auth_1.authorize)('sanction', 'admin'), ops_controller_1.getSanctionQueue);
router.patch('/sanction/:id', (0, auth_1.authorize)('sanction', 'admin'), ops_controller_1.sanctionLoan);
// Disbursement
router.get('/disbursement', (0, auth_1.authorize)('disbursement', 'admin'), ops_controller_1.getDisbursementQueue);
router.patch('/disbursement/:id/disburse', (0, auth_1.authorize)('disbursement', 'admin'), ops_controller_1.disburseLoan);
// Collection
router.get('/collection', (0, auth_1.authorize)('collection', 'admin'), ops_controller_1.getCollectionQueue);
router.post('/collection/:id/payment', (0, auth_1.authorize)('collection', 'admin'), ops_controller_1.recordPayment);
router.get('/collection/:id/payments', (0, auth_1.authorize)('collection', 'admin'), ops_controller_1.getPayments);
// Admin
router.get('/admin/applications', (0, auth_1.authorize)('admin'), ops_controller_1.getAllApplications);
router.get('/admin/users', (0, auth_1.authorize)('admin'), ops_controller_1.getAllUsers);
exports.default = router;
