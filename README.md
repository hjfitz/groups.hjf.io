## Group Peer to Peer Chat

[![Netlify Status](https://api.netlify.com/api/v1/badges/1a6495f3-1ecf-498c-9a7c-c72826b8284c/deploy-status)](https://app.netlify.com/sites/blissful-kirch-6241bc/deploys)

## 📚 About

This project is a distributed, 'serverless', fully featured video calls using WebRTC negotiation as a service. 

It aims to maintain parity of features between popular video chat services such as Zoom, Webex, Teams etc.

## 🧙 Features

* Instant connection
* Multiple peers in a room
* Screensharing
* Shared chat
* Shared whiteboard scribble area
* Custom names
* Unlimited amount of peers
* Extensible, written in TypeScript
* Automagic meeting note transcription
* Distributed thanks to WebRTC! Nobody can spy in on your meetings

To-do:

- [x] Peer disconnects remove the video from the session
- [x] Names for peers
- [] Shared chat for all peers
- [] Screen sharing (one per peer)
- [x] Better handling of video stacking... Let's pray that we don't need to use JavaScript.
- [] Kill the session if the host leaves
- [x] Better call negotiation between host and peer
- [] auto meeting note transcription
- [] meeting recording
- [] whiteboard scribble area
