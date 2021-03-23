import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const sender = req.headers && req.headers["x-ms-client-principal-id"];
  const recipient = req.body && req.body.recipient;
  const candidate = req.body && req.body.candidate;

  if (!sender) {
    context.res = {
      status: 400,
      body: "Include a user ID header!",
    };
    return;
  }

  if (!recipient || !candidate) {
    context.res = {
      status: 400,
      body: "Include a recipient and a candidate!",
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      target: "receiveIceCandidate",
      userId: recipient,
      arguments: [sender, candidate],
    },
  ];
};

export default httpTrigger;
