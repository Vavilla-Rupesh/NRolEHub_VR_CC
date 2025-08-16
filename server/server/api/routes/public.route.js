const express = require('express');
const router = express.Router();
const AdminService = require('../../modules/admin/admin.service');
const receiptGenerator = require('../../utils/receiptGenerator');

// Public route to get all student registrations (for certificate verification)
router.get('/students', async (req, res) => {
  try {
    const registrations = await AdminService.getAllStudentRegistrations();
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch student registrations'
    });
  }
});

// Public route to generate printable receipt
router.post('/receipt/print', async (req, res) => {
  try {
    const receiptHTML = receiptGenerator.generateReceiptHTML(req.body);
    res.setHeader('Content-Type', 'text/html');
    res.send(receiptHTML);
  } catch (error) {
    console.error('Generate printable receipt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate printable receipt'
    });
  }
// Public route to download receipt as PDF
router.post('/receipt/download', async (req, res) => {
  try {
    const pdfBuffer = await receiptGenerator.generateReceiptPDF(req.body);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt_${req.body.studentName?.replace(/[^a-zA-Z0-9]/g, '_') || 'receipt'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download receipt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to download receipt'
    });
  }
});
});
module.exports = router;