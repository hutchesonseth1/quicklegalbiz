import { jsPDF } from "jspdf";

const downloadPDF = (form: { title: string }) => {
  const doc = new jsPDF();
  doc.text(form.title, 10, 10);
  doc.save(`${form.title}.pdf`);
};

export default downloadPDF;