const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Video {
    id: ID!
    name: String
    description: String
    url: String
    createdBy: ID!
  }
  type VideoYoutube {
      id: ID!,
      name: String,
      description: String,
      url: String,
      thumbnail: String,
      channelTitle: String,
  }
  type Playlist {
    id: ID!
    name: String
    createdBy: ID!
    associatedProfiles: [Profile]
    videos: [Video]
  }

  type Profile {
    id: ID!
    fullName: String
    pin: String
    avatar: String
    createdBy: ID!
  }

  type Query {
    profiles: [Profile]
    playlistsByUser: [Playlist]
    videosByUser: [Video]
    playlistsByProfile(profileId: ID!): [Playlist] 
    videosByProfile(profileId: ID!): [Video]
    searchVideos(query: String!): [VideoYoutube]
    popularVideos: [VideoYoutube]
  }
`);

module.exports = schema; 

