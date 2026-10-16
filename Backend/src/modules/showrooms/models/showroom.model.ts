//D:\D-Luxury-Car-Showroom\Backend\src\modules\showrooms\models
import mongoose, {
  Schema,
  type Document,
  type Model,
} from "mongoose";

export interface IShowroom extends Document {
  name: string;
  slug: string;
  branchCode: string;

  description?: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  phoneNumbers: string[];
  email: string;

  mapUrl?: string;
  latitude?: number;
  longitude?: number;

  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];

  imageUrl?: string;
  galleryImages: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const openingHourSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    open: {
      type: String,
      default: "09:00",
    },

    close: {
      type: String,
      default: "18:00",
    },

    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const showroomSchema = new Schema<IShowroom>(
  {
    name: {
      type: String,
      required: [true, "Showroom name is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    branchCode: {
      type: String,
      required: [true, "Branch code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumbers: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      validate: {
        validator: (numbers: string[]) => numbers.length > 0,
        message: "At least one contact number is required",
      },
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    mapUrl: {
      type: String,
      trim: true,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    openingHours: {
      type: [openingHourSchema],
      default: [],
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

showroomSchema.index({
  city: 1,
  isActive: 1,
});

showroomSchema.index({
  name: "text",
  city: "text",
  branchCode: "text",
});

const Showroom: Model<IShowroom> =
  mongoose.models.Showroom ||
  mongoose.model<IShowroom>("Showroom", showroomSchema);

export default Showroom;