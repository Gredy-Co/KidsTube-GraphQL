const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Video {
    id: ID!
    title: String
    description: String
    url: String
    createdBy: ID!
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
    profiles(userId: ID!): [Profile]
    playlistsByUser(userId: ID!): [Playlist]
    videosByUser(userId: ID!): [Video]
    playlistsByProfile(profileId: ID!): [Playlist]
  }
`);

module.exports = schema; 

