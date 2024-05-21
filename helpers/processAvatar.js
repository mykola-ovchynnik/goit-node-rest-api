import fs from 'fs/promises';
import path from 'path';

const avatarsDir = path.resolve('public', 'avatars');

export const processAvatar = async reqestFileData => {
  const { path: tempPath, filename } = reqestFileData;

  const newPath = path.join(avatarsDir, filename);

  await fs.rename(tempPath, newPath);

  const avatar = path.join('public', 'avatars', filename);

  return avatar;
};
