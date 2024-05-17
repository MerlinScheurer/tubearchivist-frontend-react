const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return Intl.DateTimeFormat(navigator.language).format(dateObj);
};

export default formatDate;
