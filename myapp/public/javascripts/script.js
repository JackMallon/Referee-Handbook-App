//On Page Load
$( document ).ready(function() {
  getOrderData();
  getDonutData();
  initializeCookies();
});

//Click Handlers
//Increase Donut Quantity
$(".addOrigGlazed").click(function() { addQuantity("origGlazed") });
$(".addChocSprnk").click(function() { addQuantity("chocSprnk") });
$(".addCookie").click(function() { addQuantity("cookieKreme") });
$(".addChocIced").click(function() { addQuantity("chocIced") });
$(".addKreme").click(function() { addQuantity("kreme") });
//Add to Basket
$(".basketOrigGlazed").click(function() { addToBasket("origGlazed") });
$(".basketChocSprnk").click(function() { addToBasket("chocSprnk") });
$(".basketCookie").click(function() { addToBasket("cookieKreme") });
$(".basketChocIced").click(function() { addToBasket("chocIced") });
$(".basketKreme").click(function() { addToBasket("kreme") });


//Login
$("#submit").click(function() {
  var username = $("#username").val();
  var password = $("#password").val();
  $.post("/login", { username: username, password: password }).done(function(data){

    if(data === "manager"){
      window.location="#manager";
      getOrderData();
      getDonutData();
    }
    else if (data === "sales") {
      window.location="#sales";
    }
    else if (data === "cook"){
      window.location="#cook";
      getDonutData();
    }
    else {
      alert(data);
    }
  });
});

//Increase Donut Quantity
function addQuantity(donut) {
  $.post("/addDonut", { donut: donut }).done(function(data){
  });
  getDonutData();
}

//Adds to Basket
function addToBasket(basket) {
  $.post("/addToBasket", { basket: basket }).done(function(data){
  });
  alert("Added to Basket: " + basket);
}

//Get Basket and Proceed to Checkout
$("#checkoutButton").click(function() {
  $.post("/getSessionData", { }).done(function(data){
    var donutCodes = data.replace('undefined','');
    donutCodes = donutCodes.trim().split(" ");
    populateCheckout(donutCodes);
    window.location="#checkout";
  });
});

//Confirm Basket
$(".confirmBasket").click(function() {
  $.post("/confirmBasket", {}).done(function(data){
  });
  alert("Your order has been placed !");
  window.location="#sales";
});

//Update Order Data
function getOrderData() {
  $.post("/orderData", {}).done(function(data){
    document.getElementById("totalSales").innerHTML = "&euro;" + data[0];
    document.getElementById("numOrders").innerHTML = data[1];
  });
}

//Populate Orders
function populateCheckout(donutCodes) {
  var total = 0;
  for (var i = 0; i < donutCodes.length; i++) {
    var div = document.createElement('div');

    div.className = 'row';

    div.innerHTML =
        '<div id="row"><p id="statLabel">' + donutString(donutCodes[i]) + '</p></div>';

    document.getElementById('checkoutContainer').appendChild(div);
    total = total + getPrice(donutCodes[i]);
  }

  var total = total.toFixed(2);

  var div = document.createElement('div');

  div.className = 'row';

  div.innerHTML =
      '<div id="row"><p id="statLabel">Total:</p><div id="statCont"><p id="krmDonut">&euro;' + total + '</p></div><span id="clear"></span></div>';

  document.getElementById('checkoutContainer').appendChild(div);
}

//Update Donut Data
function getDonutData() {
  $.post("/donutData", {}).done(function(data){
    //Updates Manager Page
    document.getElementById("orgDonut").innerHTML = data[0];
    document.getElementById("chocSprnkDonut").innerHTML = data[1];
    document.getElementById("oreoDonut").innerHTML = data[2];
    document.getElementById("chocDonut").innerHTML = data[3];
    document.getElementById("krmDonut").innerHTML = data[4];
    document.getElementById("totalDonuts").innerHTML = data[5];
    //Updates Cook Page
    document.getElementById("orgDonutCook").innerHTML = data[0];
    document.getElementById("chocSprnkDonutCook").innerHTML = data[1];
    document.getElementById("oreoDonutCook").innerHTML = data[2];
    document.getElementById("chocDonutCook").innerHTML = data[3];
    document.getElementById("krmDonutCook").innerHTML = data[4];
    document.getElementById("totalDonutsCook").innerHTML = data[5];
  });
}

//Initializes Cookies
function initializeCookies() {
  $.post("/initializeCookies", {}).done(function(data){  });
}

function donutString(donutCode){
  switch(donutCode) {
  case "origGlazed":
    return "Original Glazed";
    break;
  case "chocSprnk":
    return "Chocolate Iced Glazed with Sprinkles";
    break;
  case "cookieKreme":
    return "Oreo Cookies and Kreme";
    break;
  case "chocIced":
    return "Chocolate Iced Glazed";
    break;
  case "kreme":
    return "Glazed with Kreme Filling";
    break;
  default:
    console.log("DEFAULT");
  }
}

function getPrice(donutCode){
  switch(donutCode) {
  case "origGlazed":
    return 4.50;
    break;
  case "chocSprnk":
    return 5.00;
    break;
  case "cookieKreme":
    return 5.50;
    break;
  case "chocIced":
    return 5.00;
    break;
  case "kreme":
    return 5.00;
    break;
  default:
    console.log("DEFAULT");
  }
}
