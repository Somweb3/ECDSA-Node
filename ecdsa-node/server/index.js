const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04e9e5aa67ccb16170067fa12aed222e38a36c15de684ad7e380cf835901ed84eccca511b6fd87fe336c93d1c59354cc91690d71a836478aa5bf4789633d27a6ea": 100,
  "04aeea5f3233c1016a830aad5fb3631afc8a1fbecda0e878e71d465ec8218b091a3711acb1cc509612ffdc14ea376eb7d1970c277ac403ce39ed86390344a85b31": 50,
  "044c6e34317f402fcbeabf9efa2773ffe3ade2ac18bfa6053029a96807f9c8ae22ef03888795c35d14cf762b8185bab18fa7eeb041c1b5a661be66ecef4d3c7c62": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
