# Fast Track v2

[![GitHub](https://img.shields.io/github/license/yubelgg/fast-track-v2)](https://github.com/yubelgg/fast-track-v2/blob/main/LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-12.0-brightgreen)](https://nextjs.org/)
[![Spotify API](https://img.shields.io/badge/Spotify_API-Yes-green)](https://developer.spotify.com/documentation/web-api/)

Fast Track v2 leverages Spotify's API to enhance your music experience and help you explore new music seamlessly. This project demonstrates the implementation of 3-legged OAuth authentication for secure and seamless user authorization, alongside a robust backend recommendation system to provide personalized song suggestions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [OAuth Implementation](#oauth-implementation)
- [Usage](#usage)
- [Current Development](#current-development)
- [Future Enhancements](#future-enhancements)
- [Previous Development](#previous-development)
- [License](#license)

## Features

- **Secure User Authentication:**
  - Implements Spotify's **3-legged OAuth 2.0** flow using **Next-Auth**, ensuring secure and authorized access to user data.
  
- **Dashboard Interface:**
  - Intuitive dashboard allowing users to **select playlists** and **view tracks** within those playlists.
  
- **Personalized Recommendations:**
  - Future integration of a **music recommendation system** that suggests songs based on selected playlist tracks.
  
- **Scalable Backend API:**
  - Robust backend built with **FastAPI** and **Supabase** to handle data retrieval and recommendation processing efficiently.
  
- **Real-Time Data Handling:**
  - Utilizes **Supabase's PostgreSQL** for real-time querying and data integrity, ensuring up-to-date and reliable song data.
  
- **Seamless Integration:**
  - Designed to integrate with **multiple music streaming services**, expanding the scope of music exploration and recommendations.

## Tech Stack

- **Frontend:**
  - **Next.js**: React framework for building the user interface.
  - **Next-Auth**: Authentication library for implementing OAuth 2.0.
  - **JavaScript/TypeScript**: Programming languages for frontend development.
  
- **Backend:**
  - **Python**: Core programming language for backend logic.
  - **FastAPI**: Framework for building the backend API.
  - **Supabase (PostgreSQL)**: Database for storing and querying song data.
  

## OAuth Implementation

Fast Track v2 implements Spotify's **3-legged OAuth 2.0** flow to ensure secure user authentication and authorization. This process involves:

1. **Authorization Request**: The user is redirected to Spotify's authorization page.
2. **User Grants Permission**: The user logs in to Spotify and grants permission to the app.
3. **Authorization Code**: Spotify redirects back to the app with an authorization code.
4. **Token Exchange**: The app exchanges the authorization code for access and refresh tokens.
5. **API Access**: The app uses the access token to make requests to Spotify's API on behalf of the user.

This implementation ensures that user data is protected and that the application has appropriate permissions to access Spotify's resources.

## Usage

Current development has progressed to the dashboard page, which allows users to select a playlist and view the tracks in the playlist.

![Postman](./public/postman.png)

Future development will include:

## Current Development

🚧 **Work in Progress** 🚧

We are currently focusing on:

- Developing the **backend for the music recommendation system**, including API endpoints and recommendation algorithms.
- Enhancing the **frontend dashboard design** for better user experience and functionality.

Stay tuned for updates!

## Future Enhancements

- **Music Recommendation System:**
  - Implement advanced recommendation algorithms to provide personalized song suggestions based on user-selected playlists.
  
- **Integration with Other Streaming Services:**
  - Expand the application's capability by integrating with additional music streaming platforms like Apple Music, YouTube Music, etc.
  
- **User Preferences and Profiles:**
  - Allow users to customize their preferences and view personalized profiles to enhance recommendation accuracy.

## Previous Development

- **[Fast Track v1](https://github.com/yubelgg/fast-track):**
  - Initial version of the music recommendation system with basic Spotify API integration and user authentication.

## License

This project is licensed under the [MIT License](LICENSE).
