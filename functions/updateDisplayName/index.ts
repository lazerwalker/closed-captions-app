import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const displayName = req.body.displayName;
  const userId = req.body.userId;

  // We're not validating that some properties exist
  // (e.g. phraseId, isCompleted)
  // I don't think we need to, but worth noting
  if (!displayName || !userId) {
    context.res = {
      status: 400,
      body: "Include a displayName and a userId!",
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      target: "updateDisplayName",
      arguments: [displayName, userId],
    },
  ];
};

export default httpTrigger;
