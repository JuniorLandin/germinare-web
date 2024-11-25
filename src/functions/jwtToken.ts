export const createJWT = (payload: object) => {
  const base64UrlEncode = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = "simulated_signature"; // Como é front-end, apenas simulamos a assinatura.

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};