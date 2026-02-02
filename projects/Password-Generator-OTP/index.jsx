const { useState, useEffect, useRef } = React;

export const OTPGenerator = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Generate 6-digit OTP
  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(5); // countdown from 5 seconds
  };

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearTimeout(timerRef.current);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const displayText =
    otp === ""
      ? "Click the button to generate a secure OTP"
      : otp;

  const timerText =
    timeLeft > 0
      ? `Expires in: ${timeLeft}s`
      : otp && timeLeft === 0
      ? "OTP expired. Generate a new one."
      : "";

  return (
    <div className="otp-wrapper">
      <div className="otp-card">
        <h1 className="otp-title">Secure OTP Generator</h1>

        <h2 className={`otp-value ${timeLeft > 0 ? "active" : ""}`}>
          {displayText}
        </h2>

        <p className="otp-timer">{timerText}</p>

        <button
          className="otp-button"
          onClick={generateOtp}
          disabled={timeLeft > 0}
        >
          Generate OTP
        </button>
      </div>
    </div>
  );
};
