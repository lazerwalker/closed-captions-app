import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const text = req.body && req.body.text;
  const userId = req.body && req.body.userId;

  if (!text || !userId) {
    context.res = {
      status: 400,
      body: "Include a message and a user ID!",
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      target: "text",
      arguments: [text, userId],
    },
  ];
};

export default httpTrigger;
