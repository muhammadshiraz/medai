// src/lib/utils.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export const formatBirthDate = (dateString: string) => {
  const [datePart] = dateString.split(" ");
  const date = new Date(datePart);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateAge = (birthDateString: string): number | undefined => {
  if (!birthDateString) return undefined;

  const [datePart] = birthDateString.split(" ");
  const birthDate = new Date(datePart);

  // Validate date
  if (isNaN(birthDate.getTime())) return undefined;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const formatCreatinine = (creatinine?: number | null): string => {
  if (typeof creatinine !== "number" || isNaN(creatinine)) return "-";
  return `${creatinine.toFixed(1)} mg/dL`;
};

export const getReadingStatus = (value: number) => {
  return value > 180 ? "abnormal" : "normal";
};
