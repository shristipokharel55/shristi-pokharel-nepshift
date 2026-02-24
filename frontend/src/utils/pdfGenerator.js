import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a professional PDF report with the given data
 * 
 * @param {string} title - The title of the report (e.g., "User Report")
 * @param {Array} data - Array of objects containing the data to display
 * @param {Array} columns - Array of column definitions [{ header: 'Name', dataKey: 'name' }]
 * @param {string} filename - Optional custom filename (without extension)
 */
export const generatePDF = (title, data, columns, filename = null) => {
  // starting up a new PDF document here
  const doc = new jsPDF();
  
  // getting today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // --- HEADER SECTION ---
  // adding the company name at the top
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 75, 84); // #0B4B54 - your brand color
  doc.text('NepShift', 14, 20);

  // adding the report title below the company name
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(title, 14, 30);

  // putting today's date on the right side
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${today}`, 14, 38);

  // drawing a nice line separator
  doc.setDrawColor(130, 172, 171); // #82ACAB - accent color
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // --- TABLE SECTION ---
  // this is where the magic happens - autoTable creates a nice formatted table
  autoTable(doc, {
    startY: 48, // starting position below the header
    head: [columns.map(col => col.header)], // table headers
    body: data.map(row => columns.map(col => row[col.dataKey] || 'N/A')), // table rows
    
    // making our table look professional
    theme: 'striped',
    headStyles: {
      fillColor: [11, 75, 84], // your brand color for headers
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50],
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [248, 251, 250] // very light green tint
    },
    margin: { top: 48, left: 14, right: 14 }
  });

  // --- FOOTER SECTION ---
  // adding page numbers and total count at the bottom
  const pageCount = doc.internal.getNumberOfPages();
  const footerY = doc.internal.pageSize.height - 10;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Total Records: ${data.length}`,
      doc.internal.pageSize.width / 2,
      footerY,
      { align: 'center' }
    );
  }

  // --- SAVE THE FILE ---
  // creating the filename with today's date if not provided
  const finalFilename = filename || `Nepshift_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
  doc.save(`${finalFilename}.pdf`);
};

/**
 * Utility function specifically for exporting user data
 */
export const exportUsersReport = (users, filterType = 'All') => {
  const title = filterType === 'All' ? 'All Users Report' : `${filterType} Users Report`;
  
  const columns = [
    { header: 'Name', dataKey: 'fullName' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Role', dataKey: 'role' },
    { header: 'Location', dataKey: 'location' },
    { header: 'Joined Date', dataKey: 'createdAt' },
    { header: 'Status', dataKey: 'status' }
  ];

  // looping through users to prepare clean data for the PDF
  const pdfData = users.map(user => ({
    fullName: user.fullName || 'N/A',
    email: user.email || 'N/A',
    role: (user.role || 'helper').charAt(0).toUpperCase() + user.role.slice(1),
    location: user.location || 'Not specified',
    createdAt: user.createdAt || 'N/A',
    status: user.isVerified ? 'Verified' : 'Pending'
  }));

  generatePDF(title, pdfData, columns);
};

/**
 * Utility function for exporting worker verification requests
 */
export const exportWorkerVerificationReport = (requests, filterType = 'All') => {
  const title = filterType === 'All' 
    ? 'Worker Verification Report' 
    : `Worker Verification - ${filterType}`;
  
  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Type', dataKey: 'type' },
    { header: 'User Type', dataKey: 'userType' },
    { header: 'Submitted', dataKey: 'submittedAt' },
    { header: 'Status', dataKey: 'status' }
  ];

  // preparing the verification data for export
  const pdfData = requests.map(request => ({
    name: request.name || 'N/A',
    email: request.email || 'N/A',
    type: request.type || 'KYC',
    userType: request.userType || 'Helper',
    submittedAt: request.submittedAt || 'N/A',
    status: (request.status || 'pending').charAt(0).toUpperCase() + request.status.slice(1)
  }));

  generatePDF(title, pdfData, columns);
};

/**
 * Utility function for exporting hirer verification requests
 */
export const exportHirerVerificationReport = (requests, filterType = 'All') => {
  const title = filterType === 'All' 
    ? 'Hirer Verification Report' 
    : `Hirer Verification - ${filterType}`;
  
  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Phone', dataKey: 'phone' },
    { header: 'Location', dataKey: 'location' },
    { header: 'Submitted', dataKey: 'submittedAt' },
    { header: 'Status', dataKey: 'status' }
  ];

  // getting hirer data ready for the PDF table
  const pdfData = requests.map(request => ({
    name: request.name || 'N/A',
    email: request.email || 'N/A',
    phone: request.phone || 'N/A',
    location: request.location || 'Not specified',
    submittedAt: request.submittedAt || 'N/A',
    status: (request.status || 'pending').charAt(0).toUpperCase() + request.status.slice(1)
  }));

  generatePDF(title, pdfData, columns);
};
