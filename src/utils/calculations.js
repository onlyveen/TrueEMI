const processingFees = {
  "american express": 2.0,
  "au bank": 2.0,
  axis: 1.5,
  bobcard: 1.5,
  canara: 1.0,
  citibank: 2.0,
  federal: 1.0,
  "flipkart axis": 1.5,
  hdfc: 1.0,
  hsbc: 1.5,
  icici: 2.0,
  idbi: 1.0,
  "idfc first": 1.5,
  indusind: 1.5,
  kotak: 1.5,
  onecard: 2.5,
  rbl: 1.5,
  sbi: 1.5,
  "standard chartered": 2.0,
  "yes bank": 1.5,
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
  const processingFeeRate = processingFees[cardType.toLowerCase()] || 0;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const processingFeeAmount = p * (processingFeeRate / 100);
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
  const processingFeeRate = processingFees[cardType.toLowerCase()] || 0;

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
      const processingFeeAmount = p * (processingFeeRate / 100);
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
