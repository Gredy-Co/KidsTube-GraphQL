const Profile  = require("../models/ProfileModel");
const Video    = require("../models/VideoModel");
const Playlist = require("../models/PlaylistModel");
const axios = require("axios");
const { YOUTUBE_API_KEY } = process.env;
module.exports = {
  videosByUser: async (_args, context) => {
    try {
      const user = context.user;
      console.log("Usuario autenticado desde el contexto:", user);

      if (!user) {
          throw new Error("No autorizado");
      }

      const videos = await Video.find({ createdBy: user.id });

      if (videos.length === 0) {
        throw new Error("No videos found for this user");
      }

      return videos;
    } catch (error) {
      console.error("Error getting videos:", error);
      throw new Error("Internal Server Error");
    }
  },

  playlistsByUser: async (_args, context) => {
    try {
      const user = context.user;
      console.log("Usuario autenticado desde el contexto:", user);

      if (!user) {
          throw new Error("No autorizado");
      }

      const playlists = await Playlist.find({ createdBy: user.id })
        .populate("associatedProfiles")
        .populate("videos");

      if (playlists.length === 0) {
        throw new Error("No playlists found for this user");
      }

      return playlists;
    } catch (error) {
      console.error("Error getting playlists:", error);
      throw new Error("Internal Server Error");
    }
  },

  profiles: async (_args, context) => {
    try {
      const user = context.user;
      console.log("Usuario autenticado desde el contexto:", user);

      if (!user) {
          throw new Error("No autorizado");
      }
      const profiles = await Profile.find({ createdBy: user.id });

      if (profiles.length === 0) {
        throw new Error("No profiles found for this user");
      }

      return profiles;
    } catch (error) {
      console.error("Error getting profiles:", error);
      throw new Error("Internal Server Error");
    }
  },

  playlistsByProfile: async (_args, context) => {
    try {
    

      const profile = await Profile.findById(_args.profileId);
      if (!profile) {
        throw new Error("Perfil no encontrado");
      }

      const playlists = await Playlist.find({
        "associatedProfiles": _args.profileId,
      }).populate("associatedProfiles").populate("videos");

      if (playlists.length === 0) {
        throw new Error("No playlists found for this profile");
      }

      return playlists;
    } catch (error) {
      console.error("Error getting playlists by profile:", error);
      throw new Error("Internal Server Error");
    }
  },
  VideosByProfile: async (_args, context) => {
    try {
      const { profileId } = _args.profileId;
  
      if (!profileId) {
        throw new Error("profileId es requerido");
      }
  
      // ✅ Verificar si el perfil existe y pertenece al padre autenticado
      const profile = await Profile.findById(profileId);
  
      if (!profile) {
        throw new Error("Perfil no encontrado");
      }
  
      if (!context.user || profile.createdBy.toString() !== context.user.id?.toString()) {
        throw new Error("Este perfil no te pertenece");
      }
  
      const playlists = await Playlist.find({ associatedProfiles: profileId }).populate('videos');
  
      const allVideos = playlists.reduce((acc, playlist) => {
        return acc.concat(playlist.videos);
      }, []);
  
      if (allVideos.length === 0) {
        throw new Error("No hay videos disponibles para este perfil");
      }
  
      return allVideos;
  
    } catch (error) {
      console.error("Error getting videos by profile:", error.message);
      throw new Error(error.message);
    }
  },
  SearchVideos: async (_args, context) => {
    try {
      const query = _args.query;
      if (!query) return res.status(400).json({ error: 'El parámetro "q" es requerido.' });
  
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          key: YOUTUBE_API_KEY,
          type: 'video',
          maxResults: 10
        }
      });
  
      const videos = mapYoutubeResponse(response.data.items);
      return res.json(videos);
  
    } catch (error) {
      console.error('Error al consumir la API de YouTube:', error.message);
      return res.status(500).json({ error: 'Error al buscar videos en YouTube' });
    }
  },
  
  popularVideos: async () => {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet",
          chart: "mostPopular",
          key: YOUTUBE_API_KEY,
          maxResults: 12,
          regionCode: "CO",
          safeSearch: "strict"
        }
      });

      return mapYoutubeResponse(response.data.items);

    } catch (error) {
      console.error("Error al obtener videos populares:", error.message);
      throw new Error("No se pudieron cargar los videos populares");
    }
  }
  
};
function mapYoutubeResponse(items) {
  return items.map((item) => ({
    id: item.id.videoId || item.id,
    name: item.snippet.title,
    description: item.snippet.description,
    url: `https://www.youtube.com/watch?v=${item.id.videoId || item.id}`,
    thumbnail: item.snippet.thumbnails?.high?.url,
    channelTitle: item.snippet.channelTitle,
  }));
}

