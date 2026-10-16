//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.model.ts
import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IConfiguration extends Document {
  customerId: mongoose.Types.ObjectId;

  carId?: mongoose.Types.ObjectId;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;

  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;

  status:
    | "DRAFT"
    | "SAVED"
    | "QUOTATION_REQUESTED";

  createdAt: Date;
  updatedAt: Date;
}

const configurationSchema =
  new Schema<IConfiguration>(
    {
      customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      carId: {
        type: Schema.Types.ObjectId,
        required: false,
      },

      carSlug: {
        type: String,
        required: true,
        trim: true,
      },

      carName: {
        type: String,
        required: true,
        trim: true,
      },

      color: {
        type: String,
        required: true,
        trim: true,
      },

      wheel: {
        type: String,
        required: true,
        trim: true,
      },

      interior: {
        type: String,
        required: true,
        trim: true,
      },

      engine: {
        type: String,
        required: true,
        trim: true,
      },

      variant: {
        type: String,
        required: true,
        trim: true,
      },

      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },

      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "DRAFT",
          "SAVED",
          "QUOTATION_REQUESTED",
        ],
        default: "SAVED",
      },
    },
    {
      timestamps: true,
    },
  );

configurationSchema.index({
  customerId: 1,
  createdAt: -1,
});

export const Configuration =
  (mongoose.models.Configuration as Model<IConfiguration>) ||
  mongoose.model<IConfiguration>(
    "Configuration",
    configurationSchema,
  );