const moneybox = () => {
  let savedCoins = 0;
  return (coins) => {
    savedCoins += coins;
    console.log(`MoneyBox: $${savedCoins}`);
  };
};

let money = moneybox();
money(5);
money(10);
money(1);
money(7);

//moneybox(10);

const sayHello = (name) => {
  return (saludo) => {
    console.log(`${saludo} ${name}`);
  };
};

const hellofredy = sayHello("Fredy");
hellofredy("Hello");
