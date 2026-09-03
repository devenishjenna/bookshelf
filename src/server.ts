import app from "./app";

// pull port from env or default to 3000
const PORT = Number(process.env.PORT) || 3000;

// opening port for incoming HTTP connections
app.listen(PORT, () => {
  console.log(`Server successful listening on http://localhost:${PORT}`);
});