const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "westeros_secret_archives";

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./users.json"));
  const user = users.find((user) => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ message: "A man has no name... and this person has no record." });
  }

  const token = jwt.sign({username}, SECRET, {'expiresIn': '2h'});
  res.json({token});
});

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('./users.json'));
    const user = users.find((user) => user.username === username);

    if (users.find((user) => user.username === username)) {
        return res.status(409).json({message: "This person is already recorded"});
    }

    const hashedPW = await bcrypt.hash(password, 10);
    users.push({username: username, password: hashedPW});
    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2))

    res.status(201).json({message: "Person has been added to the records"});
})


app.listen(3000, () => console.log('Running in port 3000'));
