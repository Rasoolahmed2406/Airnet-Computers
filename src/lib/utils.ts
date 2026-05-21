export const formatDate = (date: Date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const generateCustomerId = () => {
  return 'AN' + Math.floor(1000000000 + Math.random() * 9000000000);
};