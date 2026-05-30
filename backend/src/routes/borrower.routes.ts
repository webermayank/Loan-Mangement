import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';
import {
  savePersonalDetails,
  uploadSalarySlip,
  saveLoanConfig,
  applyForLoan,
  getMyApplication,
} from '../controllers/borrower.controller';

const router = Router();

router.use(protect, authorize('borrower'));

router.post('/personal-details', savePersonalDetails);
router.post('/salary-slip', upload.single('salarySlip'), handleUploadError, uploadSalarySlip);
router.post('/loan-config', saveLoanConfig);
router.post('/apply', applyForLoan);
router.get('/application', getMyApplication);

export default router;
