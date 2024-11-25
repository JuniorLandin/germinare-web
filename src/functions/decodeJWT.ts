export const decodeJWT = (token: string) => {
  try {
    const payload = token.split(".")[1]; // A segunda parte é o payload
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Erro ao decodificar o JWT:", e);
    return null;
  }
};