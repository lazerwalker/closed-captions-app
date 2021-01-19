# Twitch Closed Captions

This is a proof-of-concept/work-in-progress Electron app to make it easier to add automatic captions to your Twitch stream. 

The goal is to release an app that uses Azure Cognitive Services to perform speech transcription on microphone input, with output options to either set up open captions via an OBS browser/window capture element or closed captions by communicating with OBS over WebSockets to use the official Twitch caption API.

More documentation coming soon! This is primarily being developed live on Twitch, check out https://twitch.tv/lazerwalker and https://twitch.tv/bitandbang for livestreams.

It's worth noting that automatic ML-powered captions are NOT a replacement for professional live human CART services. Our hope is that providing an easy-to-use free or cheap option can make it easier for streams without the financial means to hire a human captioner to still provide some form of captions as an accessibility affordance.
