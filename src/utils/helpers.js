export const getInitials = (name) => {
  const clean = name.replace(/إذاعة|اذاعة|-/g, "").trim();
  const words = clean.split(" ").filter(Boolean);
  if (words.length >= 2) return words[0][0] + words[1][0];
  return clean.slice(0, 2);
};
