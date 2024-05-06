
export const generateResetToken = () => {
    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    return token;
  };
  