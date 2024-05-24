const isDevEnvironment = () => {
  console.log(import.meta.env);
  const { DEV } = import.meta.env;

  return DEV;
};

export default isDevEnvironment;
