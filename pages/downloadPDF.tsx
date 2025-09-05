import jsPDF from "jspdf";

const downloadPDF = (form: any) => {
  const doc = new jsPDF();
  doc.text(`Full Name: ${form.full_name}`, 10, 10);
  doc.text(`Message: ${form.message}`, 10, 20);
  doc.save(`form-${form.id}.pdf`);
};
