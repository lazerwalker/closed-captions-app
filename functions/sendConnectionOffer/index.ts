import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const sender = req.headers && req.headers["x-ms-client-principal-id"];

  if (!sender) {
    context.res = {
      status: 400,
      body: "Include a user ID header!",
    };
    return;
  }

  context.log(
    "SendConnectOffer data",
    sender,
    req.body.recipient,
    req.body.offer
  );

  context.bindings.signalRMessages = [
    {
      target: "receiveOffer",
      userId: req.body.recipient,
      arguments: [sender, req.body.offer],
    },
  ];
};

export default httpTrigger;
