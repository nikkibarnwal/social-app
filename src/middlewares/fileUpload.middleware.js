import multer from "multer";
import path from "path";
import { imagesPath } from "../utils/common.js";
import ApplicationError from "../error-handler/applicationError.js";
import { BAD_REQUEST_CODE } from "../config/statusCode.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApplicationError("Only images are allowed", BAD_REQUEST_CODE));
  }
};

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: fileFilter,
});

export default fileUpload;
