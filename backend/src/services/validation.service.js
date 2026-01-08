export function validateVPA(vpa) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return regex.test(vpa);
}

export function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

export function detectCardNetwork(cardNumber) {
  const num = cardNumber.replace(/[\s-]/g, "");

  if (num.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^(60|65|8[1-9])/.test(num)) return "rupay";

  return "unknown";
}

export function validateExpiry(month, year) {
  const m = parseInt(month);
  let y = parseInt(year);

  if (m < 1 || m > 12) return false;
  if (year.length === 2) y += 2000;

  const now = new Date();
  const expiry = new Date(y, m);

  return expiry >= now;
}
