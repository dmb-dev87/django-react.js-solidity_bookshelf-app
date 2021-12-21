async function main() {
  const Bookshelf = await ethers.getContractFactory("Bookshelf")
  const bookshelf = await Bookshelf.deploy()
  console.log("Contract deployed to address:", bookshelf.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  })