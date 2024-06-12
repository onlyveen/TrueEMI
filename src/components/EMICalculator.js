import { useState } from "react";
import { calculateEMI, generateEMISchedule } from "../utils/calculations";

const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const EMICalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState("months");
  const [cardType, setCardType] = useState("hdfc");
  const [results, setResults] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);

  const handleCalculate = () => {
    const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;
    const calculations = calculateEMI(
      principal.replace(/[^0-9.-]+/g, ""),
      rate,
      tenureInMonths,
      cardType
    );
    const schedule = generateEMISchedule(
      principal.replace(/[^0-9.-]+/g, ""),
      rate,
      tenureInMonths,
      cardType
    );
    setResults(calculations);
    setEmiSchedule(schedule);
  };

  const handlePrincipalChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "");
    setPrincipal(inputValue);
  };

  const handlePrincipalBlur = () => {
    setPrincipal(formatCurrency(principal));
  };

  const shareCalculation = () => {
    const message = `Check out this EMI calculation:
        Principal: ${principal}
        Rate: ${rate}%
        Tenure: ${tenure} ${tenureType}
        Monthly EMI: ${results.emi}
        Total Payment: ${results.totalPayment}
        Total Interest: ${results.totalInterest}
        Processing Fee: ${results.processingFee}
        GST on Processing Fee: ${results.gst}
        Extra Payment: ${results.extraPayment}`;
    navigator.clipboard.writeText(message);
    alert("EMI details copied to clipboard. Share with your friends!");
  };

  return (
    <div className="mod">
      <div className="container">
        <div className="splitView">
          <div className="emiCalc">
            <h1 className="title">True EMI Calculator</h1>
            <div className="inputGroup">
              <label>Principal Amount</label>
              <input
                type="text"
                value={principal}
                onChange={handlePrincipalChange}
                onBlur={handlePrincipalBlur}
              />
            </div>
            <div className="inputGroup">
              <label>Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <label>Tenure</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
              <select
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value)}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            <div className="inputGroup">
              <label>Credit Card Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="american express">American Express</option>
                <option value="au bank">AU Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="bobcard">BOBCARD</option>
                <option value="canara">Canara Bank</option>
                <option value="citibank">Citibank</option>
                <option value="federal">Federal Bank</option>
                <option value="flipkart axis">Flipkart Axis Bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="hsbc">HSBC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="idbi">IDBI Bank</option>
                <option value="idfc first">IDFC FIRST Bank</option>
                <option value="indusind">IndusInd Bank</option>
                <option value="kotak">Kotak Bank</option>
                <option value="onecard">OneCard</option>
                <option value="rbl">RBL Bank</option>
                <option value="sbi">SBI Credit Card</option>
                <option value="standard chartered">Standard Chartered</option>
                <option value="yes bank">Yes Bank</option>
              </select>
            </div>
            {principal && rate && tenure && cardType ? (
              <button className="calculateButton" onClick={handleCalculate}>
                Calculate EMI
              </button>
            ) : (
              <button className="calculateButton" disabled>
                Calculate EMI
              </button>
            )}
          </div>
          <div className="resultToggle">
            {results ? (
              <div className="results">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="results"
                    onChange={(e) => setShowTable(e.target.checked)}
                  />
                  <span className="inputSwitch">
                    <span className={!showTable && "active"}>EMI Details</span>
                    <span className={showTable && "active"}>EMI Schedule</span>
                  </span>
                </label>
                {!showTable ? (
                  <div className="results">
                    <h2>Results:</h2>
                    <p>Monthly EMI: {results.emi}</p>
                    <p>Total Payment: {results.totalPayment}</p>
                    <p>Total Interest: {results.totalInterest}</p>
                    <p>Processing Fee: {results.processingFee}</p>
                    <p>GST on Processing Fee: {results.gst}</p>
                    <p>Extra Payment: {results.extraPayment}</p>
                    <button className="shareButton" onClick={shareCalculation}>
                      Share EMI Details
                    </button>
                  </div>
                ) : (
                  <div className="scheduleDetails">
                    <h3>EMI Schedule:</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>GST on Interest</th>
                          <th>Processing Fee + GST</th>
                          <th>Total EMI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emiSchedule.map((row, index) => (
                          <tr key={index}>
                            <td>{row.month}</td>
                            <td>{row.principal}</td>
                            <td>{row.interest}</td>
                            <td>{row.gst}</td>
                            <td>{row.processingFeeGST}</td>
                            <td>{row.totalEmi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty">EMI Details will appear hear</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
