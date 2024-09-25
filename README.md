# Fast Track v2

Fast Track v2 leverages Spotify's API to enhance your music experience and explore new music. This project demonstrates the implementation of 3-legged OAuth authentication for secure and seamless user authorization.

## Table of Contents

- [Features](#features)
- [OAuth Implementation](#oauth-implementation)
- [Usage](#usage)
- [Current Development](#current-development)
- [Previous Development](#previous-development)
- [License](#license)

## Features

- Secure authentication using Spotify's 3-legged OAuth flow
- Viewing and interacting with Spotify playlists and tracks


## OAuth Implementation

Fast Track v2 implements Spotify's 3-legged OAuth flow to ensure secure user authentication and authorization. This process involves:

1. **Authorization Request**: The user is redirected to Spotify's authorization page.
2. **User Grants Permission**: The user logs in to Spotify and grants permission to the app.
3. **Authorization Code**: Spotify redirects back to the app with an authorization code.
4. **Token Exchange**: The app exchanges the authorization code for access and refresh tokens.
5. **API Access**: The app uses the access token to make requests to Spotify's API on behalf of the user.

This implementation ensures that user data is protected and that the application has appropriate permissions to access Spotify's resources.

## Usage

Current development has progressed to the dashboard page, which allows users to select a playlist and view the tracks in the playlist.

Future development will include:
- music recommendation based on the tracks in the playlist
- integration with other music streaming services

## Current Development

🚧 **Work in Progress** 🚧

We are currently focusing on:

- Backend for music recommendation system
- Frontend design of project

Stay tuned for updates!

## Previous Development

- [old github](github.com/yubelgg/fast-track)

## License

This project is licensed under the [MIT License](LICENSE).