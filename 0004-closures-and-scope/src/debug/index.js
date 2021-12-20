var a = "Hello";

function hello() {
  let b = "Hello World";
  const c = "Hello World!";

  if (true) {
    let d = "Hello World!!";
    debugger;
  }
}

hello();

const moneybox = () => {
  debugger;
  let savedCoins = 0;
  return (coins) => {
    debugger;
    savedCoins += coins;
    console.log(`MoneyBox: $${savedCoins}`);
  };
};

let money = moneybox();
money(5);
money(10);
money(1);
money(7);
