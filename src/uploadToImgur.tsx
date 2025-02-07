////////////////////Cuong//////////////////////////////// Cuong coded the whole file
import axios from 'axios';
import RNFS from 'react-native-fs';

//dab3c20d2286e0fdb8335933305d5c1e26a6eac7

const uploadImageToImgur = async (imageUri:any) => {
  const clientId = 'xxxxxx';  // Replace with your actual Imgur Client ID, I removed mine cause of obivous security issues

  try {
    // Read the image file as a base64 string
    const base64Image = await RNFS.readFile(imageUri, 'base64');

    // Upload the image to Imgur
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: base64Image,
        type: 'base64',
      },
      {
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      }
    );

    if (response.data.success) {
      const imageId = response.data.data.id;
      const imageUrl = response.data.data.link;
      console.log('Image uploaded to Imgur:', imageUrl);
      return [imageUrl,imageId];
    }
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
  }
};
export default uploadImageToImgur;