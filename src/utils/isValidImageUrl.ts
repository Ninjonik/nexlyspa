const isValidImageUrl = (message: string): boolean => {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  const lowercasedUrl = message.toLowerCase();

  if (imageExtensions.some((ext) => lowercasedUrl.endsWith(ext))) {
    return true;
  }

  return false;
};

export { isValidImageUrl };
