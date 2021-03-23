import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = req.headers && req.headers["x-ms-client-principal-id"];

  if (!userId) {
    context.res = {
      status: 400,
      body: "Include a user ID header!",
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      target: "broadcast",
      arguments: [userId],
    },
  ];
};
export default httpTrigger;
