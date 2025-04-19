const globalTeardown = async () => {
  await global._MONGOINSTANCE.stop()
}

export default globalTeardown
