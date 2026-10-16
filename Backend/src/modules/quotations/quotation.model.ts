//D:\D-Luxury-Car-Showroom\Backend\src\modules\quotations\quotation.model.ts
import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IQuotation
  extends Document {
  quotationNumber: string;

  customerId: mongoose.Types.ObjectId;

  configurationId?: mongoose.Types.ObjectId;

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

  discountAmount: number;
  taxAmount: number;

  quotationTotal: number;

  customerName: string;
  customerEmail: string;
  //customerMobile: string;

  notes?: string;

  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";

  validUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const quotationSchema =
  new Schema<IQuotation>(
    {
      quotationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      configurationId: {
        type: Schema.Types.ObjectId,
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
        default: "Standard",
        trim: true,
      },

      variant: {
        type: String,
        required: true,
        default: "Standard",
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

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      quotationTotal: {
        type: Number,
        required: true,
        min: 0,
      },

      customerName: {
        type: String,
        required: true,
        trim: true,
      },

      customerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      // customerMobile: {
      //   type: String,
      //   required: true,
      //   trim: true,
      // },

      notes: {
        type: String,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "UNDER_REVIEW",
          "APPROVED",
          "REJECTED",
          "EXPIRED",
        ],
        default: "PENDING",
      },

      validUntil: {
        type: Date,
      },
    },
    {
      timestamps: true,
    },
  );

quotationSchema.index({
  customerId: 1,
  createdAt: -1,
});

export const Quotation =
  (mongoose.models.Quotation as Model<IQuotation>) ||
  mongoose.model<IQuotation>(
    "Quotation",
    quotationSchema,
  );