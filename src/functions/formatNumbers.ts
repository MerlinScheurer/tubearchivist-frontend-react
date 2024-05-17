const formatNumbers = (number: number) => {
  const formatNumber = Intl.NumberFormat(navigator.language);
  return formatNumber.format(number);
};

export default formatNumbers;
