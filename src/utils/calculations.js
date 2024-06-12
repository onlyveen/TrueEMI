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

export const calculateEMI = (principal, rate, tenure, cardType, customFee) => {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 12 / 100; // Monthly interest rate
  const n = parseFloat(tenure);
  const gstRate = 0.18; // 18% GST

  const processingFeeAmount =
    customFee !== null
      ? parseFloat(customFee)
      : processingFees[cardType.toLowerCase()] || 0;

  // Calculate monthly EMI
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalInterest = emi * n - p; // Total interest over the loan period
  const gstOnInterest = totalInterest * gstRate; // GST on total interest
  const gstOnProcessingFee = processingFeeAmount * gstRate; // GST on processing fee

  // Total Payment calculation according to the new requirement
  const totalPayment =
    emi * n + gstOnInterest + processingFeeAmount + gstOnProcessingFee;

  return {
    emi: formatCurrency(emi),
    totalPayment: formatCurrency(totalPayment),
    totalInterest: formatCurrency(totalInterest),
    processingFee: formatCurrency(processingFeeAmount),
    gstOnProcessingFee: formatCurrency(gstOnProcessingFee),
    gstOnInterest: formatCurrency(gstOnInterest),
    extraPayment: formatCurrency(
      totalInterest + processingFeeAmount + gstOnProcessingFee + gstOnInterest
    ),
  };
};

export const generateEMISchedule = (
  principal,
  rate,
  tenure,
  cardType,
  customFee
) => {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 12 / 100; // Monthly interest rate
  const n = parseFloat(tenure);
  const processingFeeAmount =
    customFee !== null
      ? parseFloat(customFee)
      : processingFees[cardType.toLowerCase()] || 0;
  const gstRate = 0.18; // 18% GST

  let remainingPrincipal = p;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interest = remainingPrincipal * r;
    const gstOnInterest = interest * gstRate;
    const principalPayment =
      (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) - interest;

    let totalEmi = principalPayment + interest + gstOnInterest;

    // Only add processing fee and its GST for the first month
    if (month === 1) {
      const gstOnProcessingFee = processingFeeAmount * gstRate;
      totalEmi += processingFeeAmount + gstOnProcessingFee;
    }

    schedule.push({
      month,
      principal: formatCurrency(principalPayment),
      interest: formatCurrency(interest),
      gst: formatCurrency(gstOnInterest),
      totalEmi: formatCurrency(totalEmi),
      processingFeeGST:
        month === 1
          ? formatCurrency(processingFeeAmount + processingFeeAmount * gstRate)
          : formatCurrency(0),
    });

    remainingPrincipal -= principalPayment;
  }

  return schedule;
};
