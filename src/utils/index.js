const mapDBToModel = ({ 
    id,
    name,
    year
  }) => ({
    id,
    name,
    year
  });

// songs
const mapDBToSongModel = ({ 
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumid,
    created_at,
    updated_at,
  }) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumid,
    createdAt: created_at,
    updatedAt: updated_at,
  });

  const mapDBToSongModelForList = ({ 
    id,
    title,
    performer,
  }) => ({
    id,
    title,
    performer,
  });

  // playlist
  const mapDBToModelPlaylist = ({
    id,
    name,
    owner
  }) => ({
    id,
    name,
    username: owner
  })

  module.exports = { 
    mapDBToModel,
    mapDBToSongModel,
    mapDBToSongModelForList,
    mapDBToModelPlaylist
  };
