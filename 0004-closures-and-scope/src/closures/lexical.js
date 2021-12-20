const buildCount = (i) => {
  let count = i;
  return () => {
    console.log(++count);
  };
};

const cuenta = buildCount(0);
cuenta();
cuenta();
cuenta();

const otracuenta = buildCount(10);
otracuenta();
otracuenta();

cuenta();
cuenta();

otracuenta();
otracuenta();
otracuenta();
