export const handleEventInternal = async (_: any) => {
  console.log("============lambda called================")

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: "Hi Valentina :heart:"
  }
}
