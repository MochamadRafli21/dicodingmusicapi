const mapDBToModel = ({ 
    id,
    name,
    year,
    created_at,
    updated_at,
  }) => ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
  });

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

  module.exports = { mapDBToModel, mapDBToSongModel , mapDBToSongModelForList};
