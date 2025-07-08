export const generateUsername = (): string => {
  const usernamePrefix = "user-";
  const randomCharacters = Math.random().toString(36).substring(2);
  const username = usernamePrefix + randomCharacters;
  return username;
};
