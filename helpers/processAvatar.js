import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import Jimp from 'jimp';

const avatarsDir = path.resolve('public', 'avatars');

const generateAvatar = email => {
  const avatarURL = gravatar.url(email, { format: 'jpg', d: 'retro' }, true);

  return avatarURL;
};

const processImage = async imagePath => {
  Jimp.read(imagePath)
    .then(image => {
      return image
        .cover(
          250,
          250,
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
        )
        .write(imagePath);
    })
    .catch(error => console.log(error.message));
};

const getAvatarURL = async file => {
  const { path: tempPath, filename } = file;

  const newPath = path.join(avatarsDir, filename);

  await fs.rename(tempPath, newPath);

  await processImage(newPath);

  const avatar = path.join('avatars', filename);

  return avatar;
};

export default { getAvatarURL, generateAvatar };
