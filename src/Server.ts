// src/index.ts

import App from './App';

const app = App.system
const port: number = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});