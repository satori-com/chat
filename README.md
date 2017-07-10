# Satori Chat Demo

![Satori Image](public/satori-logo-banner.jpg)

Satori provides an API that sends data between apps at high speed. The API uses a publish/subscribe model: Apps *publish* data of any type to a *channel*, and other apps *subscribe* to that channel and retrieve data from it. The API, based on WebSocket, transfers any amount of data with almost no delay.

Satori APIs also let you customize channels:
- Satori **streambots** subscribe to a channel and execute custom code on each incoming message. You create a streambot using a Satori Java API.
- Satori **views** select, transform, or aggregate messages from a channel based on criteria you define in SQL.

The chat demo app shows you how the Satori API works. The demo app does the following:
- Creates a Satori channel for publishing chat messages
- Subscribes to the Satori channel so it can receive chat messages from other demo app users.
- Displays a time-limited chat room and lets you invite others to participate.
- Sets up a Satori streambot that provides weather information based on your location.
- Sets up a Satori view that select the weather information from a public Satori channel that gets information from the National Weather Service.

**Hint:** Send the chat room URL to **lots** of people and see how well it performs.

# Run the online demo
A live version of the demo is available at [https://chat.satori.com](https://chat.satori.com). To see the demo, open the link in a browser running on a computer and follow the instructions on the screen.

# Run the demo locally
You can get the source files for the demo and run it locally. The source includes the browser JavaScript that runs the chat room and the Satori API library. The source also includes a small server that helps with the demo. It's not part of the Satori ecosystem; instead, it helps you offer the demo UI and JavaScript to other computers and mobile devices.

## Prerequisites
The demo has these external prerequisites:

- A computer that supports Node.js.
- Node.js version 6.0.0 or later

Ensure that the Node package manager `npm` is available.

All of the code for the demo is included in the GitHub clone, or it is installed using `npm` after you have the code.

## Set up a Satori project
The demo uses the following Satori features that you set up in your own Satori project:
- Private data channels, which require an appkey and an endpoint.
- User roles for the channels

Satori projects are free. To create one, you need a Satori account, which is also free.

### Set up the appkey and endpoint:
1. Log in or sign up for a Satori account at [https://developer.satori.com](https://developer.satori.com).
1. From the dashboard, navigate to the **Projects** page.
1. Click **Add a project**, then enter the name "Chat" and click **Add**.
1. Satori displays the **appkey** and **endpoint** for your project. Make a copy of the values. After you get the demo code, you add the values to a config file.
1. Click **Save**.

### Set up the "user" and "admin" user roles :
1. Click the **Roles** tab, then click **Add a role**.
1. To set up the **user** role, enter `user`, then click **Add**. This returns you to the **Roles** tab.
1. To set up the **admin** role, enter `admin`, then click **Add**. This returns you to the **Roles** tab.

### Get the role secret key for the user role:
1. On the **Roles** tab, find the **Role secret key** column.
1. Copy the role secret key for **user**. After you get the demo code, you add the key to a config file.

### Set up channel permissions for the **user** user role :
1. In the roles table, click **user** to display its details page.
1. Click the **Channel permission** tab.
1. In the table, click the asterisk (`*`) namespace wildcard to display the **Channel permission info** page. These channel permissions apply to all channels associated with the **user** user role.
1. In the table, click the * namespace wildcard to display the **Channel permission info** page. These channel permissions apply to all channels associated with the **user** user role.
1. In the **"Publish" Action Permission** dropdown, select **Forbid**. Leave **"Subscribe" Action Permission** set to **Permit**. Click **Save**.
1. In the breadcrumbs at the top of the page, click **Channel permissions** to return to the **Channel permission** tab.
1. Click **Add a channel permission**, then enter the following:
    - **Namespace:** channel-manager
    - **"Publish" Action Permission:** Select **Permit** from the dropdown.
    - **"Subscribe" Action Permission:** Select **Forbid** from the dropdown.
1. Click **Add** to save the permissions and return to the details page for the **user** user role.
1. In the breadcrumbs at the top of the page, Click **Roles** to return to the **Roles** tab.

You don't need to set up channel permissions for the **admin** user role, because the default permissions are sufficient.

### Save your work
1. From the **Roles** tab, click the **General** tab.
1. Click **Save**.

## Get the demo code
The demo code is available in a public GitHub repository. It's based on React, using the [Create React App](https://github.com/facebookincubator/create-react-app) framework, so you have access to all the tools provided by `react-scripts`.

1. Clone the demo source files from GitHub:

```git clone git@github.com:satori-com/chat.git```

1. Build the code
```
npm install
```

**Note:** The [Create React App documentation](https://github.com/facebookincubator/create-react-app/blob/master/README.md) describes the framework in more detail. To learn more about creating Satori projects for your own apps, see the [Dev Portal tutorial](https://www.satori.com/docs/tutorials/tutorial-steps-devportal).

## The demo server
The demo code includes a small server. It doesn't have a role in the Satori ecosystem. Instead, it simplifies the demo. On a computer, you can open `chat/public/index.html` instead of running the server. The HTML loads the demo JavaScript app, which establishes communication with the Satori ecosystem.

Without the server, however, each computer that wants to use the demo has to have a copy of index.html and the JavaScript. Also, the technique only works on computers, because mobile devices don't have a way of opening local HTML files or JavaScript.

With the server running, any computer or device that wants to use the demo can navigate to the server's IP address and port.

## Run the demo

### Set up the config file

1. In `chat-demo`, copy the file `.env` to `env.local`, then edit `.env.local` and update it with the appkey, endpoint, role name and role secret key values you copied:

```
REACT_APP_ENDPOINT='<endpoint_value>'
REACT_APP_APPKEY='<appkey_value>'
REACT_APP_ROLE='<role_name_value>'
REACT_APP_ROLE_SECRET='<role_secret_key_value>'
```

1. Set the app history value to keep a maximum of 8 hours of chats, expressed in seconds:
```
REACT_APP_HISTORY_MAX_COUNT='28800'
```
1. Set the geolocation flag so that the app can give you weather information based on your location:
```
REACT_APP_USE_GEOLOCATION='true'
```
1. Save `.env.local`.

### Set up the streambots

#### Add the streambots to Satori
1. If necessary, log in to [https://developer.satori.com](https://developer.satori.com).
1. Navigate to the **Bots** page.
1. Click **Add a bot**. Enter the following values:
    * **Bot name:** moderator-bot
    * **Platform:** Select **JavaScript** from the dropdown.
    * **Executable:** Click the file icon, then select `chat/bots/moderator-bot.js`
1. Click **Add**.
1. In the breadcrumbs at the top of the page, click **Bots** to return to the **Bots** page.
1. Click **Add a bot**. Enter the following values:
    * **Bot name:** weather-bot
    * **Platform:** Select **JavaScript** from the dropdown.
    * **Executable:** Click the file icon, then select `chat/bots/weather-bot.js`.
1. Click **Add**.

#### Add streambot instances to the project

First, add the moderator streambot:
1. If necessary, log in to [https://developer.satori.com](https://developer.satori.com).
1. Navigate to the **Projects** page.
1. Click **chat** to open the Chat project details page.
1. On the tab bar, click **Bot instances**.
1. Click **Add a bot instance**.
1. Enter the following values:
    * **Bot name:** moderator-bot
    * **Role:** admin
    * **Appkey:** Click in the entry box and select the displayed value.
    * **Bot:** Select moderator-bot from the dropdown
    * **Version:** Click the dropdown. Select the displayed value.
    * Leave the other fields unchanged.
1. If the **Channel Subscriptions** section is collapsed, expand it, then enter the following values:
    * **Channel-name:** moderator-channel
    * Leave the other fields unchanged.
1. Click **Save** to save your work and return to the chat project info page.

Next, add the weather streambot:
1. From the chat project info page, click **Bot instances** in the tab bar.
1. Click **Add a bot instance**.
1. Enter the following values:
    * **Bot name:** weather-bot
    * **Role:** admin
    * **Appkey:** Click in the entry box and select the displayed value.
    * **Bot:** Select moderator-bot from the dropdown
    * **Version:** Click the dropdown. Select the displayed value.
    * Leave the other fields unchanged.
1. If the **Channel Subscriptions** section is collapsed, expand it, then enter the following values:
    * **Channel-name:** moderator-channel
    * Leave the other fields unchanged.
1. Click **Save** to save your work and return to the chat project info page.

After you add the streambot instances, Satori needs about 30 seconds to start them. When they're ready, their status on the chat project info page changes from **Pending** to **Running**. When the streambot instances are running, run the demo.

### Run demo using the provided server
To run the demo using the server provided in the demo code:

1. Run the server
```
npm run start
```

This starts the local demo server, which uses port 3000.
To chat with others:
1. Don't use the displayed link, because it just displays the URL for your local server. You need your server's IP address and channel information.
1. Instead, switch focus to the terminal app in which you started the server. A message lists the IP address of the server on your local network.
1. Copy the URL and send it to the users you want to chat with.

### Run demo from your own server
To run the demo using your own server:
1. Build the demo for deployment
```
npm run build
```
1. Deploy the build to your server. All the necessary files are in the directory `chat/build`. The demo main page is in `chat/build/index.html`.

# App architecture
The chat app uses the following Satori components:
- Satori JavaScript API
- Satori Open Channels
- Satori streambots
- Satori views
- Satori Key-Value Store.

As noted, it also uses the React Create App framework.

## Moderator streambot (**moderator**)
This streambot is the controller for the chat app. It creates channels, manages and stores metadata, and publishes messages as needed.

## channel-manager
Moderator creates, publishes to, and subscribes to the **channel-manager** channel.  By sending and retrieving metadata messages with channel-manager, moderator tracks user metadata, enforces security, and sends messages to streambots subscribed to other channels:
- **User metadata**: Although moderator sends and retrieves user metadata with channel-manager, the channel doesn't hold an infinite number of messages. To ensure the metadata is always available, moderator stores it in the Satori Key-Value Store. With this information, moderator can update newly-joined app instances with metadata, even if the original messages are no longer available.
- **Security**: To ensure that app instances can only read messages in rooms to which they were invited, apps are not allowed read access to `channel-manager`. Instead, app instances read from their chat room channel.
- **Streambots**: Moderator controls the weather streambot by publishing bot_message messages to channel-manager. When the weather streambot receives a bot_message, it retrieves data from the National Weather Service and publishes it to channel-manager.

## Presence emulation
App instances periodically post update_presence messages to `channel-manager`. Moderator processes and republishes these messages to a presence channel for the chat rooms.  When users join the chat room, the app instance reads the presence channel to determine who is actively using the chat room.

#### Weather streambot
The chat room demo includes a streambot that delivers weather information in response to requests posted in a chat room.  The bot subscribes to channel-manager and waits for bot_message messages that contain weather requests. When it receives one, it handles the request by applying a custom Satori view to the Satori National Weather Service Open Channel.  The weather streambot then publishes its response to `channel-manager`. Moderator processes and republishes this message in the same way that it publishes chats between users.

# Next steps
Try extending the demo to include more chat functionality and different streambots or views (or both).

You can embed this app in your apps or in other demo apps we offer.

# Further reading
- [Satori Developer Documentation](https://wwwstage.satori.com/docs/introduction/new-to-satori): Documentation for the entire Satori Live Data Ecosystem
- [Satori JavaScript SDK](https://github.com/satori-com/satori-rtm-sdk-js): The Satori JavaScript API and developer tools
- [Satori JavaScript tutorial](https://wwwstage.satori.com/docs/tutorials/javascript-tutorial)):  Tutorial that shows you how to write JavaScript apps that use the SDK and the [Satori Live Messaging](https://wwwstage.satori.com/docs/using-satori/rtm-api) platform
