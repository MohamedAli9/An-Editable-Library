// My name is Mohamed, and this javaScritpt file for my Project.

/* The array of objects that holds the information of the books.
   CoverImage is preloaded using open library urls with the correct 
   isbn for ech book
*/
let books = [
  {
    "title": "Can't Hurt Me",  
    "author": "David Goggins",
    "CopyRightDate": 2018,
    "NumberOfPages": 364,
    "CoverImage": "https://covers.openlibrary.org/b/isbn/1544507852-L.jpg"
  },
  {
    "title": "Atomic Habits",
    "author": "James Clear",
    "CopyRightDate": 2018,
    "NumberOfPages": 320,
    "CoverImage": "https://covers.openlibrary.org/b/isbn/9780593207093-L.jpg"     
    
  },
  {
    "title": "Unfuck Your Brain", 
    "author": "Faith G. Harper", 
    "CopyRightDate": 2017,   
    "NumberOfPages": 192,  
    "CoverImage": "https://covers.openlibrary.org/b/isbn/1934620777-L.jpg"
  }
  
]


/**
 * allCSSProperties function utilize the class function
 * in jQuery. I made all my css classes in the css file and then
 * used them by accessing them with .assClass attr.
 
 * */
function allCSSProperties() {

    $("#header").addClass("header");
    $("#row").addClass("row");
    $("#tittleOne").addClass("tittleOne");
    $("#tittleTwo").addClass("tittleTwo");
    $("#tittleThree").addClass("tittleThree");
    $("#listOfBooks").addClass("listOfBooks");
    $("#BookInfo").addClass("BookInfo");
    $("#pictues").addClass("pictues");
    $("#pic").addClass("pic");
    $("#footer").addClass("footer");

}

// this glopal variable keeps track of the new book the user added.
let currentTitle;


//load javasCript whenever document is ready/
$(document).ready(main);



 // main calls the load functions.
function main () {
  allCSSProperties()
  loadDefault()
  createListOfItems();
  addEventListenerToListOfItems();
  addButtonListeners();
}

/**
 * The loadDefault functuon check if already there are books in the
 * localStorage, and put every book into the local storage with them
 * being stringfied.
 * */
function loadDefault() {
    // If the banana is not in local storage, we will conclude that none
    // of the default items are there, and we put them into local storage.
    var bookObject = localStorage.getItem("Banana");
    if( bookObject == null) {
        console.log("Loading from hard-coded array");
        for( var i = 0; i < books.length; i++) {
            var book = books[i];
            localStorage.setItem(book.title, JSON.stringify(book));
        }
    }
   
}


/**
 * createListOfItems function creates list items for the books 
 * that are in the local storage and puts them into an emply navigation
 * in html. when taking books from the local Storage, the function parses
 * every book.
 * */
function createListOfItems () {
  var list = "<ul>\n";
    for( var i = 0; i < localStorage.length; i ++) {
        var bookString = localStorage.getItem( localStorage.key( i));
        var bookObject = JSON.parse( bookString);
        list += "<li>" + bookObject.title + "</li>\n";
    }
    list += "</ul>\n";
  $("nav").html(list);

}

/**
 * addEventListenerToListOfItems function adds eventListeners to 
 * each and every book of list items, and then calls info function
 * which displays the information about the book that is clicked
 * on the screen.
 * */
function addEventListenerToListOfItems() {
  var listofNodes = $("li"); //document.getElementsByTagName("li")
  for( var i = 0; i < listofNodes.length; i++) {
    var node = listofNodes[i];
    console.log( "found the li node " + listofNodes[i].innerHTML);
    node.addEventListener( "click", info);
  }
}

/**
 * Adds a click listener to the buttons on the page.
 * it also call edit, add, and del fucntion which will
 * modify the page.
 * */
function addButtonListeners() {
    $("#editbutton").on("click", edit);
    $("#addbutton").on("click", add);
    $("#deletebutton").on("click", del);
}

/**
 * edit function allows the users to enter or exit edit mode for the chosen book item.
 *  it only allows the author, number of pages, and data only.
 * edit function takes care of two situations. one is save mode. when you are
 * in the save mode, you can not touch any thing else. The other edit mode which
 * can allow you to edit the data.
 * 
 * */
function edit() {
    let buttonText = this.innerHTML;
    if( buttonText == "Edit") {
        $("#author").removeAttr("readonly");
        $("#date").removeAttr("readonly");
        $("#pages").removeAttr("readonly");
        this.innerHTML = "Save";
    }
    else {
        // Leave edit mode and save any changes to localStorage
        $("#title").attr("readonly", true);
        $("#author").attr("readonly", true);
        $("#date").attr("readonly", true);
        $("#pages").attr("readonly", true);
        this.innerHTML = "Edit";
        // save the values to local storage 
        var newObject= {};
        newObject.title = $("#title").val();
        newObject.author = $("#author").val();
        newObject.CopyRightDate = $("#date").val();
        newObject.NumberOfPages = $("#pages").val();
        newObject.CoverImage = $("#pic").attr("src");
        localStorage.setItem( newObject.title, JSON.stringify(newObject));
    }
}



/*
 * add function allows the user to enter information for a new food item, and save
 * it to local storage. it also send an http request and informationReceived function.
 */
function add() {
    let buttonText = this.innerHTML;
    if( buttonText == "Add") {
        this.innerHTML = "Save";
        // Make all fields editable, set values to some default value
        $("#title").removeAttr("readonly").val("Book title");
        $("#author").removeAttr("readonly").val("Author Name");
        $("#date").removeAttr("readonly").val("Date it was published");
        $("#pages").removeAttr("readonly").val("Number Of Pages");
        $("#image").removeAttr("readonly").val("");
    }
     else {
         this.innerHTML = "Add"
        var newObject= {};
        newObject.title = $("#title").val();
        newObject.author = $("#author").val();
        newObject.CopyRightDate = $("#date").val();
        newObject.NumberOfPages = $("#pages").val();
        newObject.CoverImage = "";//document.getElementById("pic").src;
        localStorage.setItem( newObject.title, JSON.stringify(newObject));

        currentTitle = $("#title").val();

        let titleString = $("#title").val();
        $.ajax({url: "http://openlibrary.org/search.json?title=" + titleString, success: informationReceived });
        createListOfItems();
        addEventListenerToListOfItems();


     }
}

/**
 * informationReceived function recieves data that is returned by the API of
 * Open library. I do not have to parse. it is already an object.
 * when the right isbn is found, then I set the full url to that book.
 * And then I stringfy the the data and put it back into the localStorage.
 * */
function informationReceived(dataObject) {
    let isbns = dataObject.docs[0].isbn[0];
    let imgaeString = "https://covers.openlibrary.org/b/isbn/"+isbns+"-L.jpg"
    let theNewBook = JSON.parse(localStorage.getItem(currentTitle));
    theNewBook.CoverImage = imgaeString
    let stringiedObjedt = JSON.stringify(theNewBook)
    localStorage.setItem(currentTitle, stringiedObjedt);
}


/**
 * this function takes care of the save mode on the edit button
 * by not allowing you to hit other parts of the page while you are in 
 * the save mode
 * */
function EditSaveMode() {
    let editButton = $("#editbutton");
    if( editButton.html() == "Save") {
        // Still in edit mode, please don't actually select a new item
        alert("You are still in edit mode. Save first!");
        return;
    }
}

/**
 * this function takes care of the save mode on the add button
 * by not allowing you to hit other parts of the page while you are in 
 * the save mode
 * */
function AddSaveMode() {
    let addButton = $("#addbutton");
  if( addButton.html() == "Save") {
        // Still in edit mode, please don't actually select a new item
        alert("You are still in add mode. Save first!");
        return;
    }
}

/**
 * infro function display all the information about the book that
 * is selected by the user whether it is the tittle, image, pages and so on.
 * */
function info() {
    EditSaveMode();
    AddSaveMode();
    var bookName = this.innerHTML;
    var targetBooksString = localStorage.getItem(bookName);
    if( targetBooksString == null) {
        // alert
        return;
    }
    targetBook = JSON.parse( targetBooksString);
    $("#title").val(targetBook.title);
    $("#author").val(targetBook.author);
    $("#date").val(targetBook.CopyRightDate);
    $("#pages").val(targetBook.NumberOfPages);
    $("#image").val(targetBook.CoverImage);
    $("#pic").attr("src",targetBook.CoverImage);
}
/**
 * del function deletes the currently selected item.
 * it also rebuilds the name list and calls selecNothing 
 * to erase all the information the book deleted has.
 * */
function del() {
    console.log("Delete is Woring. Nice !")
    let bookName = $("#title").val();
    localStorage.removeItem( bookName);
    createListOfItems();
    addEventListenerToListOfItems();
    selectNothing();
}

/**
 * selectNothing function deselects any item by setting all the information fields to
 *  their initial values in the html document.
 * */
function selectNothing() {
        document.getElementById("title").value = "None";
        document.getElementById("author").value = "None";
        document.getElementById("date").value = "0";
        document.getElementById("pages").value = "0";
        document.getElementById("image").value = "None";
 }



















