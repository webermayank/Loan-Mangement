import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getLeads,
  getSanctionQueue,
  sanctionLoan,
  getDisbursementQueue,
  disburseLoan,
  getCollectionQueue,
  recordPayment,
  getPayments,
  getAllApplications,
  getAllUsers,
} from '../controllers/ops.controller';

const router = Router();
router.use(protect);

// Sales
router.get('/leads', authorize('sales', 'admin'), getLeads);

// Sanction
router.get('/sanction', authorize('sanction', 'admin'), getSanctionQueue);
router.patch('/sanction/:id', authorize('sanction', 'admin'), sanctionLoan);

// Disbursement
router.get('/disbursement', authorize('disbursement', 'admin'), getDisbursementQueue);
router.patch('/disbursement/:id/disburse', authorize('disbursement', 'admin'), disburseLoan);

// Collection
router.get('/collection', authorize('collection', 'admin'), getCollectionQueue);
router.post('/collection/:id/payment', authorize('collection', 'admin'), recordPayment);
router.get('/collection/:id/payments', authorize('collection', 'admin'), getPayments);

// Admin
router.get('/admin/applications', authorize('admin'), getAllApplications);
router.get('/admin/users', authorize('admin'), getAllUsers);

export default router;
