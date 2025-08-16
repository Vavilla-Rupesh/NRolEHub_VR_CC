const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs").promises;

class ReceiptGenerator {
  constructor() {
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 15;
    this.logoPath = path.join(__dirname, "../../../public/logo.png");
    this.primaryColor = "#1E40AF";
    this.sectionBgColors = ["#DBEAFE", "#F3F4F6", "#DBEAFE"];
    this.textColor = "#1f2937";
    this.lineHeight = 12;
    this.borderColor = "#9CA3AF";
    this.shadowColor = "#d1d5db";
    this.font = "times"; // Times New Roman
    this.headingTopMargin = 6; // extra top margin for headings
  }

  async addLogoAndHeader(pdf) {
    try {
      const imgBuffer = await fs.readFile(this.logoPath);
      const logoWidth = 40;
      const logoHeight = 40;
      const gap = 10;

      const headerText = "NRolEHub";
      const subText = "Narayana Engineering College";

      pdf.setFont(this.font, "bold");
      pdf.setFontSize(24);
      const headerWidth = pdf.getTextWidth(headerText);
      pdf.setFontSize(12);
      pdf.setFont(this.font, "normal");
      const subWidth = pdf.getTextWidth(subText);

      const textBlockWidth = Math.max(headerWidth, subWidth);
      const totalWidth = logoWidth + gap + textBlockWidth;
      const startX = (this.pageWidth - totalWidth) / 2;
      const logoX = startX;
      const textX = logoX + logoWidth + gap;

      pdf.addImage(imgBuffer, "PNG", logoX, 15, logoWidth, logoHeight);

      pdf.setFont(this.font, "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(this.primaryColor);
      pdf.text(headerText, textX, 35);

      pdf.setFont(this.font, "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(this.textColor);
      pdf.text(subText, textX, 45);
    } catch (err) {
      console.error("Error adding logo and header:", err);
    }
  }

  drawGradientBackground(pdf) {
    const steps = 100;
    const startColor = [255, 255, 255];
    const endColor = [240, 248, 255];
    for (let i = 0; i < steps; i++) {
      const r = startColor[0] + ((endColor[0] - startColor[0]) * i) / steps;
      const g = startColor[1] + ((endColor[1] - startColor[1]) * i) / steps;
      const b = startColor[2] + ((endColor[2] - startColor[2]) * i) / steps;
      pdf.setFillColor(r, g, b);
      pdf.rect(
        0,
        (this.pageHeight / steps) * i,
        this.pageWidth,
        this.pageHeight / steps,
        "F"
      );
    }
  }

  drawSectionWithText(pdf, yStart, lines, fillColor, maxHeight = null) {
    const x = this.margin;
    const sectionWidth = this.pageWidth - 2 * x;
    const sectionHeight = lines.length * this.lineHeight + 16; // 8px padding top/bottom

    // Adjust height if exceeding maxHeight
    const finalHeight =
      maxHeight && yStart + sectionHeight > maxHeight
        ? maxHeight - yStart
        : sectionHeight;

    // Shadow
    pdf.setFillColor(this.shadowColor);
    pdf.roundedRect(
      x + 1.5,
      yStart + 1.5,
      sectionWidth,
      finalHeight,
      2,
      2,
      "F"
    );

    // Background
    pdf.setFillColor(fillColor);
    pdf.roundedRect(x, yStart, sectionWidth, finalHeight, 2, 2, "F");

    let y = yStart + 12;
    lines.forEach(({ label, value }, index) => {
      if (y > yStart + finalHeight - 6) return; // don't overflow
      pdf.setFont(this.font, "bold");
      pdf.setTextColor(this.primaryColor);
      pdf.text(`${label}:`, x + 5, y);

      pdf.setFont(this.font, "normal");
      pdf.setTextColor(this.textColor);
      pdf.text(value, x + 60, y);

      if (index < lines.length - 1) {
        pdf.setDrawColor("#E5E7EB");
        pdf.setLineWidth(0.3);
        pdf.line(x + 2, y + 4, x + sectionWidth - 2, y + 4);
      }
      y += this.lineHeight;
    });

    return { bottomY: yStart + finalHeight, sectionWidth, x, yStart: yStart };
  }

  async generateReceiptPDF(receiptData) {
    try {
      const pdf = new jsPDF();
      pdf.setFont(this.font, "normal");
      this.drawGradientBackground(pdf);

      pdf.setDrawColor(this.borderColor);
      pdf.setLineWidth(0.5);
      pdf.rect(5, 5, this.pageWidth - 10, this.pageHeight - 10);

      await this.addLogoAndHeader(pdf);

      pdf.setFont(this.font, "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(this.textColor);
      pdf.text("Payment Receipt", this.pageWidth / 2, 70, { align: "center" });

      let y = 80;

      // Student Info
      y += this.headingTopMargin;
      pdf.setFont(this.font, "bold");
      pdf.setTextColor(this.primaryColor);
      pdf.text("Student Information", this.margin, y);
      y+=2; // no bottom margin

      const studentSection = this.drawSectionWithText(
        pdf,
        y,
        [
          { label: "Name", value: receiptData.studentName },
          { label: "Email", value: receiptData.studentEmail },
        ],
        this.sectionBgColors[0]
      );
      y = studentSection.bottomY + 6;

      // Event Info
      y += this.headingTopMargin;
      pdf.setFont(this.font, "bold");
      pdf.setTextColor(this.primaryColor);
      pdf.text("Event Information", this.margin, y);
      y+=2;

      const eventSection = this.drawSectionWithText(
        pdf,
        y,
        [
          { label: "Main Event", value: receiptData.mainEventName },
          { label: "Sub Event", value: receiptData.subEventName },
          {
            label: "Event Duration",
            value: `${receiptData.startDate} to ${receiptData.endDate}`,
          },
          { label: "Venue", value: receiptData.venue },
        ],
        this.sectionBgColors[1]
      );
      y = eventSection.bottomY + 6;

      // Payment Info
      y += this.headingTopMargin;
      pdf.setFont(this.font, "bold");
      pdf.setTextColor(this.primaryColor);
      pdf.text("Registration & Payment Info", this.margin, y);
      y+=2;

      const remainingHeight = this.pageHeight - y - 35;
      const paymentLines = [
        {
          label: "Reg Type",
          value: receiptData.isFree
            ? "FREE Event"
            : "Paid Event"
        },
        {
          label: "Reg Date",
          value: receiptData.registrationDate,
        },
      ];

      if (!receiptData.isFree)
        paymentLines.splice(1, 0, {
          label: "Payment ID",
          value: receiptData.paymentId,
        });
      else paymentLines.splice(1, 0, { label: "Amount", value: "FREE" });

      const paymentSection = this.drawSectionWithText(
        pdf,
        y,
        paymentLines,
        this.sectionBgColors[2],
        y + remainingHeight
      );

      // Amount badge
      if (!receiptData.isFree) {
        const amountText = `Rs. ${receiptData.amount}`;
        const badgePaddingX = 8;
        const badgePaddingY = 4;
        const textWidth = pdf.getTextWidth(amountText) + 2 * badgePaddingX;
        const badgeHeight = this.lineHeight + 2 * badgePaddingY;

        const badgeX = paymentSection.x + paymentSection.sectionWidth - textWidth - 5;
        const badgeY = paymentSection.bottomY - badgeHeight - 5;

        pdf.setFillColor("#cbd5e1");
        pdf.roundedRect(badgeX + 1.5, badgeY + 1.5, textWidth, badgeHeight, 2, 2, "F");

        pdf.setFillColor(this.primaryColor);
        pdf.roundedRect(badgeX, badgeY, textWidth, badgeHeight, 2, 2, "F");

        pdf.setTextColor("#ffffff");
        pdf.setFont(this.font, "bold");
        pdf.text(amountText, badgeX + textWidth / 2, badgeY + badgeHeight / 2, {
          align: "center",
          baseline: "middle",
        });
      }

      // Footer
      y = paymentSection.bottomY + 8;
      pdf.setFont(this.font, "normal");
      pdf.setFontSize(10);
      pdf.setTextColor("#6B7280");
      pdf.text(
        "This is a computer-generated receipt. No signature required.",
        this.margin,
        y
      );
      y += 5;
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, this.margin, y);

      return Buffer.from(pdf.output("arraybuffer"));
    } catch (error) {
      console.error("Error generating receipt PDF:", error);
      throw error;
    }
  }

  async saveReceiptPDF(receiptData, filename) {
    try {
      const pdfBuffer = await this.generateReceiptPDF(receiptData);
      const receiptsDir = path.join(process.cwd(), "receipts");
      await fs.mkdir(receiptsDir, { recursive: true });
      const filePath = path.join(receiptsDir, filename);
      await fs.writeFile(filePath, pdfBuffer);
      return filePath;
    } catch (error) {
      console.error("Error saving receipt PDF:", error);
      throw error;
    }
  }
}

module.exports = new ReceiptGenerator();
