function triggerError(req, res, next) {
  throw new Error("Intentional 500 error!")
}