//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.model.ts
import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface ITestDrive
  extends Document {
  customerId: mongoose.Types.ObjectId;

  carId?: mongoose.Types.ObjectId;

  carSlug: string;
  carName: string;

  fullName: string;
  email: string;
  mobile: string;

  date: Date;
  time: string;

  location: string;

  notes?: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";

  createdAt: Date;
  updatedAt: Date;
}

const testDriveSchema =
  new Schema<ITestDrive>(
    {
      customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      carId: {
        type: Schema.Types.ObjectId,
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

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      mobile: {
        type: String,
        required: true,
        trim: true,
      },

      date: {
        type: Date,
        required: true,
      },

      time: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      notes: {
        type: String,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "CONFIRMED",
          "COMPLETED",
          "CANCELLED",
        ],
        default: "PENDING",
      },
    },
    {
      timestamps: true,
    },
  );

testDriveSchema.index({
  customerId: 1,
  date: -1,
});

export const TestDrive =
  (mongoose.models.TestDrive as Model<ITestDrive>) ||
  mongoose.model<ITestDrive>(
    "TestDrive",
    testDriveSchema,
  );