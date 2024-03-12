
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Created an express app and set the port number
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Used the public folder for static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", {searchResult: [], noResult: "", errorImg: "/PngItem_42075.png"});
});

// we get user input with body-parser and based on that input we post request to the API and link the data that we get to html
app.post("/search", async (req, res) => {
  const searchBar = req.body.searchBar;
  const category = req.body.category;
  const cuisines = req.body.cuisines;
  try {
    const searchResult = await axios.get("https://api.spoonacular.com/recipes/complexSearch",
     {params: {
      apiKey: `ac3749ccbcef42d3a6afb23d96139349`,
      query: searchBar,
      cuisine: cuisines,
      type: category,
     }});
    res.render("index.ejs", {searchResult: searchResult.data.results, noResult: "No Results Found", errorImg: '/pngwing.com.png'});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { 
      error: error.message, 
    });
  }});

// based on which recipe user clicks, we get the ID with body-parser and with that ID we post request to the API
app.post("/recipe", async (req, res) => {
  const recipeId = req.body.id;
  try {
    const searchResult = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`,
     {params: {
      apiKey: `ac3749ccbcef42d3a6afb23d96139349`,
     }});
    res.render("recipe.ejs", {searchResult: searchResult.data});
    console.log();
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { 
      error: error.message, 
    });
  }});


// Listening on my predefined port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
