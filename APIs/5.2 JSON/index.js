import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

//Step 1: Run the solution.js file without looking at the code.
//Step 2: You can go to the recipe.json file to see the full structure of the recipeJSON below.
var recipesJSONStr, recipesJSON;
fs.readFile("recipe.json", "utf8", (err, data) => {
  if (err) throw err;
  recipesJSON = JSON.parse(data);
});

const recipeJSON =
  '[{"id": "0001","type": "taco","name": "Chicken Taco","price": 2.99,"ingredients": {"protein": {"name": "Chicken","preparation": "Grilled"},  "salsa": {"name": "Tomato Salsa","spiciness": "Medium"},  "toppings": [{"name": "Lettuce",  "quantity": "1 cup",  "ingredients": ["Iceberg Lettuce"]  },      {"name": "Cheese",  "quantity": "1/2 cup",  "ingredients": ["Cheddar Cheese", "Monterey Jack Cheese"]  },      {"name": "Guacamole",  "quantity": "2 tablespoons",  "ingredients": ["Avocado", "Lime Juice", "Salt", "Onion", "Cilantro"]  },      {"name": "Sour Cream",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream"]  }      ]    }  },{"id": "0002","type": "taco","name": "Beef Taco","price": 3.49,"ingredients": {"protein": {"name": "Beef","preparation": "Seasoned and Grilled"},  "salsa": {"name": "Salsa Verde","spiciness": "Hot"},  "toppings": [{"name": "Onions",  "quantity": "1/4 cup",  "ingredients": ["White Onion", "Red Onion"]  },      {"name": "Cilantro",  "quantity": "2 tablespoons",  "ingredients": ["Fresh Cilantro"]  },      {"name": "Queso Fresco",  "quantity": "1/4 cup",  "ingredients": ["Queso Fresco"]  }      ]    }  },{"id": "0003","type": "taco","name": "Fish Taco","price": 4.99,"ingredients": {"protein": {"name": "Fish","preparation": "Battered and Fried"},  "salsa": {"name": "Chipotle Mayo","spiciness": "Mild"},  "toppings": [{"name": "Cabbage Slaw",  "quantity": "1 cup",  "ingredients": [    "Shredded Cabbage",    "Carrot",    "Mayonnaise",    "Lime Juice",    "Salt"          ]  },      {"name": "Pico de Gallo",  "quantity": "1/2 cup",  "ingredients": ["Tomato", "Onion", "Cilantro", "Lime Juice", "Salt"]  },      {"name": "Lime Crema",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream", "Lime Juice", "Salt"]  }      ]    }  }]';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

function findRecipe(choice) {
  var recipes = [];
  recipesJSON.forEach((recipe) => {
    if (recipe.ingredients.protein.name.toLowerCase() === choice)
      recipes.push(recipe);
  });

  return recipes;
}

app.post("/recipe", (req, res) => {
  res.render("index.ejs", {
    choice: req.body.choice,
    recipe: findRecipe(req.body.choice)[0],
  });
  //Step 3: Write your code here to make this behave like the solution website.
  //Step 4: Add code to views/index.ejs to use the recieved recipe object.
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
