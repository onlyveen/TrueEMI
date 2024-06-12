const processingFees = {
  "american express": 199,
  "au bank": 199,
  axis: 0,
  bobcard: 199,
  canara: 199,
  citibank: 945,
  federal: 199,
  "flipkart axis": 199,
  hdfc: 199,
  hsbc: 99,
  icici: 199,
  idbi: 199,
  "idfc first": 199,
  indusind: 249,
  kotak: 199,
  onecard: 199,
  rbl: 199,
  sbi: 199,
  "standard chartered": 945,
  "yes bank": 199,
};

const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const calculateEMI = (principal, rate, tenure, cardType) => {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 12 / 100;
  const n = parseFloat(tenure);
  const processingFeeAmount = processingFees[cardType.toLowerCase()] || 0;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const gst = processingFeeAmount * 0.18;
  const extraPayment = totalInterest + processingFeeAmount + gst;

  return {
    emi: formatCurrency(emi),
    totalPayment: formatCurrency(totalPayment),
    totalInterest: formatCurrency(totalInterest),
    processingFee: formatCurrency(processingFeeAmount),
    gst: formatCurrency(gst),
    extraPayment: formatCurrency(extraPayment),
  };
};

export const generateEMISchedule = (principal, rate, tenure, cardType) => {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 12 / 100;
  const n = parseFloat(tenure);
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const processingFeeAmount = processingFees[cardType.toLowerCase()] || 0;

  const schedule = [];
  let remainingPrincipal = p;
  let processingFeeAdded = false;

  for (let month = 1; month <= n; month++) {
    const interest = remainingPrincipal * r;
    const gstOnInterest = interest * 0.18;
    const principalPayment = emi - interest;

    let totalEmi = emi;
    let processingFeeGST = 0;

    if (!processingFeeAdded) {
      const gstOnProcessingFee = processingFeeAmount * 0.18;
      totalEmi += processingFeeAmount + gstOnProcessingFee;
      processingFeeGST = formatCurrency(
        processingFeeAmount + gstOnProcessingFee
      );
      processingFeeAdded = true;
    }

    schedule.push({
      month,
      principal: formatCurrency(principalPayment),
      interest: formatCurrency(interest),
      gst: formatCurrency(gstOnInterest),
      totalEmi: formatCurrency(totalEmi),
      processingFeeGST: month === 1 ? processingFeeGST : formatCurrency(0),
    });

    remainingPrincipal -= principalPayment;
  }

  return schedule;
};
