export const generateShareText = (promptText, storyText) => {
  const header =
    "This story was ✨ ~magically~ ✨ created on 🔮 storygenie.co 🪔";
  const footer = "Find your own story at storygenie.co";
  return `${header}\n-----\nPrompt:\n${promptText}\n...\n${storyText}\n-----\n${footer}`;
};
