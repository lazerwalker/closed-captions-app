import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const caption = req.body.caption;

  // We're not validating that some properties exist
  // (e.g. phraseId, isCompleted)
  // I don't think we need to, but worth noting
  if (!caption.text || !caption.userId) {
    context.res = {
      status: 400,
      body: "Include a message and a user ID!",
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      target: "text",
      arguments: [caption],
    },
  ];
};

export default httpTrigger;
