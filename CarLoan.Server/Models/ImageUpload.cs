namespace CarLoan.Server.Models
{
    public class ImageUpload
    {
        public static string UploadImage(string BaseUrl, string rootFolderPath, string imageBase64, string imageExtension, string imageFolder)
        {
            var base64 = imageBase64.Replace("data:image/jpeg;base64,", "").Replace("data:image/png;base64,", "");
            var buffer = Convert.FromBase64String(base64);
            var path = rootFolderPath + imageFolder;
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            string imageName = Guid.NewGuid().ToString() + "_" + imageExtension;
            string imgPath = Path.Combine(path, imageName);
            imageName = Path.Combine(imageFolder, imageName);
            System.IO.File.WriteAllBytes(imgPath, buffer);
            return BaseUrl + imageName;
        }
    }
}





//namespace CarLoan.Server.Models
//{
//    public class ImageUpload
//    {
//        public static string UploadImage(string BaseUrl, string rootFolderPath, string imageBase64, string imageExtension, string imageFolder)
//        {
//            if (string.IsNullOrWhiteSpace(imageBase64))
//            {
//                throw new ArgumentException("Base64 image data is missing or invalid.");
//            }

//            var base64 = imageBase64.Replace("data:image/jpeg;base64,", "").Replace("data:image/png;base64,", "");
//            byte[] buffer;

//            try
//            {
//                buffer = Convert.FromBase64String(base64);
//            }
//            catch (FormatException ex)
//            {
//                throw new ArgumentException("Invalid base64 string.", ex);
//            }

//            var path = Path.Combine(rootFolderPath, imageFolder);
//            if (!Directory.Exists(path))
//            {
//                Directory.CreateDirectory(path);
//            }

//            string imageName = Guid.NewGuid() + imageExtension;
//            string imgPath = Path.Combine(path, imageName);
//            File.WriteAllBytes(imgPath, buffer);
//            return BaseUrl + "/" + imageFolder + "/" + imageName;
//        }

//    }
//}










































































