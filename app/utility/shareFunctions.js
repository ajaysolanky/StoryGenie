export const generateShareText = (storyText) => {
  const header =
    "This story was ✨ ~magically~ ✨ created on 🔮 storygenie.co 🪔";
  const footer = "Find your own story at storygenie.co";
  return `${header}\n-----\n${storyText}\n-----\n${footer}`;
};
