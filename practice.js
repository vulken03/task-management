//accessing array items
const programming = ["javascript", "java", "python", "php"];
console.log(programming[1]);

//multidimensional array
let student1 = ["Jack", 24];
let student2 = ["Sara", 23];
let student3 = ["Peter", 24];
let studentsData = [student1, student2, student3];

//accessing multidimensional array
console.log(studentsData[2][1]); //ans is=24

//add items with push and unshift
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.push("Kiwi"); //add guava at last position
fruits.unshift("guava"); //add guava at first position
console.log("fruits list", fruits);

//remove items with pop and shift
fruits.pop(); //remove last Item
fruits.shift(); //remove first item.
console.log("fruits list after pop", fruits);

//remove any number of consecutive elements from anywhere in an array
const alphabet = ["A", "B", "C", "D"];
alphabet.splice(2, 1);
console.log(alphabet);

//add items using splice
alphabet.splice(3, 0, "D", "C");
console.log(alphabet);

//copy array with slice
const alphabet2 = alphabet.slice(0);
console.log(alphabet2);

//copy array with spread operator
let thisArray = [true, true, undefined, false, null];
let thatArray = [...thisArray];
console.log(thatArray);

//combine array with spread operator
let combineArray = [...thisArray, ...thatArray];
console.log("combine Array", combineArray);

//Check For The Presence of an Element With indexOf()
const fruit = ["Banana", "Orange", "Apple", "Mango"];
fruit.indexOf("Apple"); // Returns 2

//Iterate Through All Array's Items Using For Loops
let numbers = [65, 44, 12, 4];
let sum = 0;
numbers.forEach((number) => {
  sum += number;
});
console.log("sum", sum);

//Add Key-Value Pairs to JavaScript Objects using object.assign
/*there are multiple instances of some of the properties of the objects.
 In this case the method Object.assign() takes the lastly assigned value of a property.
  For instance, in all the 3 objects "obj1", "obj2", and "obj3 property 
  'c' is common and assigned values such as 1,3 and 0 respectively. 
  The value of property 'c' in obj3 overrides the other previously assigned values 1 and 3. 
  So if we look at the output, property 'c' is assigned with a value 0.*/
var obj1 = { a: 10, b: 20, c: 1 };
var obj2 = { b: 30, d: 10, c: 3 };
var obj3 = { e: 60, d: 70, c: 0 };
var obj = Object.assign({}, obj1, obj2, obj3);
console.log("object", obj);

//Access Property Names with Bracket Notation
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue",
};
console.log(person["firstName"]);

//Use the delete Keyword to Remove Object Properties
delete person.age;

//Check if an Object has a Property
const hero = {
  name: "Batman",
};
hero.hasOwnProperty("name"); // => true
hero.hasOwnProperty("realName"); //=>false
"name" in hero; // => true
"realName" in hero; // => false

//Iterate Through the Keys of an Object with a for...in Statement
let txt = " ";
for (let i in person) {
  txt += person[i];
}
console.log("txt", txt);

//Generate an Array of All Object Keys with Object.keys()
const myArray = Object.keys(person);
console.log(myArray);

//Modify an Array Stored in an Object
let user = {
  name: "Kenneth",
  age: 28,
  data: {
    username: "kennethCodesAllDay",
    joinDate: "March 26, 2016",
    organization: "freeCodeCamp",
    friends: ["Sam", "Kira", "Tomo"],
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
    },
  },
};

function addFriend(userObj, friend) {
  // change code below this line
  userObj.data.friends.push(friend);
  return userObj.data.friends;
  // change code above this line
}

console.log(addFriend(user, "Pete"));

//Use typeof to Check the Type of a Variable
const a = "";
console.log(typeof a);

//Catch Mixed Usage of Single and Double Quotes - escape chars
const asd = "my name is 'Viraj' and I am \"21\" years old";
console.log(asd);

//Array - Filter & Reduce
//filter
const number1 = [45, 9, 4, 19];
const number2 = number1.filter((number) => {
  return number > 18;
});
console.log(number2);

//reduce
const number3 = [45, 4, 9, 16, 25];
let sums = number3.reduce((total, number) => {
  return total + number;
});
console.log(sums);

const myFunc = (a, b, ...c) => {
  console.log("a", a);
  console.log("b", b);
  console.log("c", c);
};
myFunc(2, 3, 4, 5, 6, 7, 8);
console.log(typeof myFunc);

//recursive call
let count = (fromNumber) => {
  console.log(fromNumber);
  if (fromNumber > 0) {
    count(fromNumber - 1);
  }
};
count(3);
