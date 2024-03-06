export function capitalizeEachWord(str: string) {
  const trimmed: string | null = str?.trim()?.toLowerCase();
  const words: string[] = trimmed?.split(" ") || [];
  const capitalizedWords: string[] =
    words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }) || [];
  return capitalizedWords.join(" ");
}

export function convertCamelCaseToCapitalCase(str: string) {
  const trimmed: string | null = str?.trim();
  const camelCaseSplit: string[] =
    trimmed.split(/(?=[A-Z])/).map((s) => s.toLowerCase()) || [];
  const capitalizedWords: string[] =
    camelCaseSplit.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }) || [];
  return capitalizedWords.join(" ");
}

export function sanitizeString(inputString: string | undefined): string {
  // Remove special characters and whitespace
  if (typeof inputString === "string") {
    return inputString.replace(/[^\w]+/gi, "")?.trim();
  } else {
    return "";
  }
}
