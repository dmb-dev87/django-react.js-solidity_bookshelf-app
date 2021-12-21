const {expect} = require("chai");
const {ethers} = require("hardhat");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

describe("Bookshelf Contract", function () {
  let Bookshelf;
  let bookshelf;
  let owner;

  const NUM_UNFINISHED_BOOK = 5;
  const NUM_FINISHED_BOOK = 3;

  let unfinishedBookList;
  let finishedBookList;

  function verifyBook(bookChain, book) {
    expect(book.name).to.equal(bookChain.name);
    expect(book.year.toString()).to.equal(bookChain.year.toString());
    expect(book.author).to.equal(bookChain.author);
  }

  function verifyBookList(booksFromChain, bookList) {
    expect(booksFromChain.length).to.not.equal(0);
    expect(booksFromChain.length).to.equal(bookList.length);
    for (let i = 0; i < bookList.length; i++) {
      const bookChain = booksFromChain[i];
      const book = bookList[i];
      verifyBook(bookChain, book);
    }
  }

  beforeEach(async function () {
    Bookshelf = await ethers.getContractFactory("Bookshelf");
    [owner] = await ethers.getSigners();
    bookshelf = await Bookshelf.deploy();

    unfinishedBookList = [];
    finishedBookList = [];

    for (let i = 0; i < NUM_UNFINISHED_BOOK; i++) {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'finished': false
      };
      await bookshelf.addBook(book.name, book.year, book.author, book.finished);
      unfinishedBookList.push(book);
    }

    for (let i = 0; i < NUM_FINISHED_BOOK; i++) {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'finished': true
      };
      await bookshelf.addBook(book.name, book.year, book.author, book.finished);
      finishedBookList.push(book);
    }
  })

  describe("Add Book", function () {
    it("Should emit AddBook event", async function () {
      let book = {
        'name': getRandomInt(1, 1000).toString(),
        'year': getRandomInt(1800, 2021),
        'author': getRandomInt(1, 1000).toString(),
        'finished': true
      };
      await expect(
        bookshelf.addBook(book.name, book.year, book.author, book.finished)
      ).to.emit(bookshelf, 'AddBook')
        .withArgs(owner.address, NUM_UNFINISHED_BOOK + NUM_FINISHED_BOOK)
    })
  })

  describe("Get Book", function () {
    it("Should return the correct unfinished books", async function () {
      const booksFromChain = await bookshelf.getUnfinishedBooks()
      expect(booksFromChain.length).to.equal(NUM_UNFINISHED_BOOK);
      verifyBookList(booksFromChain, unfinishedBookList);
    })
    it("Should return the correct finished books", async function () {
      const booksFromChain = await bookshelf.getFinishedBooks()
      verifyBookList(booksFromChain, finishedBookList);
    })
  })

  describe("Set Finished", function() {
    it("Should emit SetFinished event", async function () {
      const BOOK_ID = 0;
      const BOOK_FINISHED = true;

      await expect(
        bookshelf.setFinished(BOOK_ID, BOOK_FINISHED)
      ).to.emit(
        bookshelf, 'SetFinished'
      ).withArgs(
        BOOK_ID, BOOK_FINISHED
      )
    })
  })
})