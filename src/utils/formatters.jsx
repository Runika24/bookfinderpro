// src/utils/formatters.js

// Format authors array into a string
export const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return "Unknown Author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
};

// Format subjects array into a readable list (limit to avoid overflow)
export const formatSubjects = (subjects, limit = 5) => {
  if (!subjects || subjects.length === 0) return [];
  
  // Clean subjects (capitalize first letter, remove extra characters if needed)
  const cleaned = subjects.map(
    (subj) => subj.charAt(0).toUpperCase() + subj.slice(1)
  );

  return cleaned.slice(0, limit); // limit subjects for UI
};

// Optional: Utility for safe text truncation
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
