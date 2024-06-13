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
  const [customFee, setCustomFee] = useState("");
  const [useCustomFee, setUseCustomFee] = useState(false);

  const handleCalculate = () => {
    const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;
    const feeToUse = useCustomFee ? customFee : null; // Pass null to use predefined fee
    const calculations = calculateEMI(
      principal.replace(/[^0-9.-]+/g, ""),
      rate,
      tenureInMonths,
      cardType,
      feeToUse
    );
    const schedule = generateEMISchedule(
      principal.replace(/[^0-9.-]+/g, ""),
      rate,
      tenureInMonths,
      cardType,
      feeToUse
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
    let emiDetails = emiSchedule
      .map(
        (month, index) => `Month ${index + 1}: Total EMI - ${month.totalEmi}`
      )
      .join("\n");

    const message = `Check out this EMI schedule:\n${emiDetails}\nAll the EMIs includes 18% gst on interest and Frist month includes processing fee with 18% gst`;
    navigator.clipboard.writeText(message);
    alert("EMI schedule details copied to clipboard. Share with your friends!");
  };

  return (
    <div className="mod">
      <div className="container">
        <div className="splitView">
          {!results ? (
            <div class="header-section">
              <img src="./assets/logo.svg" />
              <p class="tagline">See What's Really Behind Your EMIs!</p>
              <ul class="usp-list">
                <li>
                  <span>🎭</span>
                  <strong>Unmask Hidden Fees</strong>
                  <p>
                    Do you find something off in you EMI? Find out every tiny
                    charge hiding behind your monthly payments. No more gotchas!
                  </p>
                </li>
                <li>
                  <span>🤜🤛</span>
                  <strong>BFF Budgeting</strong>
                  <p>
                    Say goodbye to awkward money talks with your pals. Whether
                    you're buying that dream bike or the latest smartphone on
                    your buddy's card, we keep it all crystal clear!
                  </p>
                </li>
                <li>
                  <span>💳</span>
                  <strong>Track Every Rupee</strong>
                  <p>
                    How much extra? Track every rupee over the sticker price
                    when you opt for EMIs. Be smart and see where your money's
                    going!
                  </p>
                </li>
              </ul>
            </div>
          ) : null}
          <div className="emiCalc">
            <h1 className="title">EMI Calculator</h1>
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
              <div className="flexIT">
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
            </div>
            <div className="inputGroup">
              <label>Credit Card Type</label>

              {useCustomFee ? (
                <input
                  type="number"
                  value={customFee}
                  onChange={(e) => setCustomFee(e.target.value)}
                  placeholder="Enter custom fee"
                />
              ) : (
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
              )}
              <label className="flexItLabel">
                <input
                  type="checkbox"
                  checked={useCustomFee}
                  onChange={(e) => setUseCustomFee(e.target.checked)}
                />
                <span>Use Custom Processing Fee:</span>
              </label>
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

          {results ? (
            <div className="resultToggle">
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
                  <div className="detailedEmi">
                    <h3 className="apart">
                      <span>EMI Details</span>{" "}
                      <button
                        className="shareButton"
                        onClick={shareCalculation}
                      >
                        Share <img src="./assets/share.svg" />
                      </button>
                    </h3>
                    <div className="green grid">
                      <p>
                        <span className="small">Monthly EMI</span>
                        <span className="val">{results.emi}</span>
                      </p>
                      <p>
                        <span className="small">Total Payment</span>
                        <span className="val">{results.totalPayment}</span>
                      </p>
                      <p>
                        <span className="small">Total Interest</span>
                        <span className="val">{results.totalInterest}</span>
                      </p>
                    </div>
                    <div className="red grid">
                      <p className="note">
                        Hidden Charges (most of the banks wont inform you this)
                      </p>
                      <p>
                        <span className="small">Processing Fee + GST</span>
                        <span className="val">
                          {results.processingFee} + {results.gstOnProcessingFee}
                        </span>
                      </p>
                      <p>
                        <span className="small">GST on Interest</span>
                        <span className="val">{results.gstOnInterest}</span>
                      </p>
                      <p className="red">
                        <span className="small">Extra Payment</span>
                        <span className="val">{results.extraPayment}</span>
                      </p>
                    </div>
                    <p className="disc">
                      Note (*) : Please note that the calculated values are
                      estimates based on the information you provided and may
                      vary slightly due to rounding or other minor factors.
                    </p>
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
            </div>
          ) : null}
        </div>
      </div>
      <div className="container footer">
        <p>
          Created with ❤️ by{" "}
          <a href="://praveengorakala.com" target="_blank">
            Pra<b>VeeN</b> Gorakala
          </a>{" "}
          & Chat GPT
        </p>
      </div>
    </div>
  );
};

export default EMICalculator;
