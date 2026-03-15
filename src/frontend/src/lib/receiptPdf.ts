import { PaymentMode } from "../backend";
import { formatINR } from "./moneyINR";

interface ReceiptData {
  receiptNo: number;
  studentName: string;
  parentName: string;
  classLabel: string;
  totalFee: number;
  date: Date;
  amountPaid: number;
  paymentMode: PaymentMode;
  remainingBalance: number;
}

const paymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.cash]: "Cash",
  [PaymentMode.bhim]: "BHIM",
  [PaymentMode.phonePe]: "PhonePe",
  [PaymentMode.googlePay]: "Google Pay",
};

export function generateReceipt(data: ReceiptData): void {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) {
    alert("Please allow popups to download the receipt");
    return;
  }

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Receipt - ${data.studentName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header-logo-left {
          height: 60px;
          width: auto;
        }
        .header-logo-right {
          height: 40px;
          width: auto;
        }
        .header-center {
          flex: 1;
          text-align: center;
          padding: 0 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header h2 {
          margin: 8px 0 0 0;
          font-size: 16px;
          font-weight: normal;
        }
        .details {
          margin: 20px 0;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 12px 20px;
        }
        .detail-label {
          font-weight: normal;
          color: #666;
          text-align: left;
        }
        .detail-value {
          font-weight: bold;
          text-align: left;
        }
        .divider {
          grid-column: 1 / -1;
          border-bottom: 1px solid #ddd;
          margin: 8px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          text-align: center;
          font-style: italic;
          color: #666;
        }
        @media print {
          body {
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="/assets/generated/global-school-logo.dim_512x512.png" alt="Global School Logo" class="header-logo-left" />
        <div class="header-center">
          <h1>Fee Payment Receipt</h1>
        </div>
        <img src="/assets/epic school name 4K HD Quality.png" alt="Global High School" class="header-logo-right" />
      </div>
      
      <div class="details">
        <div class="detail-label">Receipt No:</div>
        <div class="detail-value">${data.receiptNo}</div>
        
        <div class="divider"></div>
        
        <div class="detail-label">Student Name:</div>
        <div class="detail-value">${data.studentName}</div>
        
        <div class="detail-label">Parent Name:</div>
        <div class="detail-value">${data.parentName}</div>
        
        <div class="detail-label">Class:</div>
        <div class="detail-value">${data.classLabel}</div>
        
        <div class="divider"></div>
        
        <div class="detail-label">Total Fee (Academic Year):</div>
        <div class="detail-value">${formatINR(data.totalFee)}</div>
        
        <div class="divider"></div>
        
        <div class="detail-label">Date:</div>
        <div class="detail-value">${data.date.toLocaleDateString("en-IN")}</div>
        
        <div class="detail-label">Amount Paid:</div>
        <div class="detail-value">${formatINR(data.amountPaid)}</div>
        
        <div class="detail-label">Payment Mode:</div>
        <div class="detail-value">${paymentModeLabels[data.paymentMode]}</div>
        
        <div class="detail-label">Remaining Balance:</div>
        <div class="detail-value">${formatINR(data.remainingBalance)}</div>
      </div>
      
      <div class="footer">
        <p>Thank you for your payment!</p>
        <p>Global School - Internal Office Use</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
}
