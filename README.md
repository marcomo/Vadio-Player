# Vadio | Player

The *Vadio Player* leverages the Vadio API to search for music videos 
by title, artist, and country and gives the user the ability to save them
to a playlist for watching later.

**Feature overview:**  
- Search results are added to, not replaced  
- Videos can be added from the search list to the playlist  
- Search list clears on refresh  
- Playlist persists after refreshing or relaunching your browser  
- Video player view area loads videos from YouTube  

## Up and running
1. Clone the app: `git clone https://github.com/marcomo/vadio_api_project.git`
2. Go to the app directory: `cd vadio_app_project`
3. Make sure you have Node.js installed. ([Node Installer](https://nodejs.org/en/download/))
4. Install the app dependencies: `npm install`
5. Run the app: `node app.js`
6. In you browser, go to: [http://localhost:4240](http://localhost:4240)
7. Search for videos, add them to your playlist, and watch!

## Requirements
- A command line tool
- A modern browser  
  - I'm using some CSS3 and HTML5. Chrome or Firefox should do the trick.
- Down time to watch music videos

## Tech Stack
- Node.js (Server)
- Express (Web App Framework)
- Jade (Templating)
- Sass (CSS Preprocessor)
- localStorage (for persisting data)

## Dependencies
- Node.js
- **The application will provide:**  
  - express 4.13.1
  - jade 1.11.0
  - node-sass-middleware 0.8.0
  - jQuery

## ToDos:
- Route to different contexts based on user provided parameters
  - If only a title is provided, route to `/video`
  - If only an artist name is provided, route to `/artist`
  - If a title and artist partial is provided, route to `/recording`
- Reordering of playlist items with up/down controls and/or drag-n-drop
- Multiple playlists
- Play queue (e.g. YouTube)
- Tiled views
- Play/Pause control from the lists
- Handling of Vevo videos (I couldn't find any...)
- Modularize client-side JS!

## Known Bugs:
- If an item is searched twice, the search list shows two instances. When one instance is added to the playlist and then removed, the second instance cannot be added or played as the data has been removed from the data stores. This can be fixed by removing all instances of a search item when adding it to the playlist
- When adding multiple items to playlist in a row, only the first clicked is added
- Items in playlist don't stay in the order they were added (most recent first)
