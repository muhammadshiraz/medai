export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.ok;
  } catch {
    return false;
  }
};
