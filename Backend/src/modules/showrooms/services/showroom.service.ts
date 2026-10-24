//D:\D-Luxury-Car-Showroom\Backend\src\modules\showrooms\services\showroom.service.ts
import mongoose from "mongoose";

import Showroom, {
  type IShowroom,
} from "../models/showroom.model.js";

export interface ShowroomInput {
  name: string;
  slug: string;
  branchCode: string;

  description?: string;

  address: string;
  city: string;
  state: string;
  country?: string;
  postalCode: string;

  phoneNumbers: string[];
  email: string;

  mapUrl?: string;
  latitude?: number;
  longitude?: number;

  openingHours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];

  imageUrl?: string;
  galleryImages?: string[];

  isActive?: boolean;
}

export class ShowroomService {
  private static normalizeSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private static normalizeInput(
    input: Partial<ShowroomInput>
  ): Partial<ShowroomInput> {
    const data = { ...input };

    if (typeof data.name === "string") {
      data.name = data.name.trim();
    }

    if (typeof data.slug === "string") {
      data.slug = this.normalizeSlug(data.slug);
    } else if (typeof data.name === "string") {
      data.slug = this.normalizeSlug(data.name);
    }

    if (typeof data.branchCode === "string") {
      data.branchCode = data.branchCode.trim().toUpperCase();
    }

    if (typeof data.city === "string") {
      data.city = data.city.trim();
    }

    if (typeof data.email === "string") {
      data.email = data.email.trim().toLowerCase();
    }

    if (Array.isArray(data.phoneNumbers)) {
      data.phoneNumbers = data.phoneNumbers
        .map((phone) => phone.trim())
        .filter(Boolean);
    }

    return data;
  }

  static async getPublicShowrooms(filters: {
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(
      50,
      Math.max(1, filters.limit ?? 12)
    );

    const query: Record<string, unknown> = {
      isActive: true,
    };

    if (filters.city?.trim()) {
      query.city = {
        $regex: filters.city.trim(),
        $options: "i",
      };
    }

    if (filters.search?.trim()) {
      const search = filters.search.trim();

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { branchCode: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const [showrooms, total] = await Promise.all([
      Showroom.find(query)
        .sort({ city: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Showroom.countDocuments(query),
    ]);

    return {
      showrooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPublicShowroomBySlug(slug: string) {
    return Showroom.findOne({
      slug: this.normalizeSlug(slug),
      isActive: true,
    }).lean();
  }

  static async getManagementShowrooms(filters: {
    search?: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(
      100,
      Math.max(1, filters.limit ?? 20)
    );

    const query: Record<string, unknown> = {};

    if (typeof filters.isActive === "boolean") {
      query.isActive = filters.isActive;
    }

    if (filters.search?.trim()) {
      const search = filters.search.trim();

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { branchCode: { $regex: search, $options: "i" } },
      ];
    }

    const [showrooms, total] = await Promise.all([
      Showroom.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Showroom.countDocuments(query),
    ]);

    return {
      showrooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getManagementShowroomById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid showroom ID");
    }

    return Showroom.findById(id);
  }

  static async createShowroom(input: ShowroomInput) {
    const data = this.normalizeInput(input);

    const existing = await Showroom.findOne({
      $or: [
        { slug: data.slug },
        { branchCode: data.branchCode },
      ],
    });

    if (existing) {
      throw new Error(
        "Showroom slug or branch code already exists"
      );
    }

    return Showroom.create({
      ...data,
      country: data.country || "India",
      isActive: data.isActive ?? true,
    });
  }

  static async updateShowroom(
    id: string,
    input: Partial<ShowroomInput>
  ) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid showroom ID");
    }

    const data = this.normalizeInput(input);

    if (Object.keys(data).length === 0) {
      throw new Error("No update fields provided");
    }

    const existingShowroom = await Showroom.findById(id);

    if (!existingShowroom) {
      throw new Error("Showroom not found");
    }

    if (data.slug || data.branchCode) {
      const duplicateConditions: Record<string, unknown>[] = [];

      if (data.slug) {
        duplicateConditions.push({ slug: data.slug });
      }

      if (data.branchCode) {
        duplicateConditions.push({
          branchCode: data.branchCode,
        });
      }

      const duplicate = await Showroom.findOne({
        _id: { $ne: id },
        $or: duplicateConditions,
      });

      if (duplicate) {
        throw new Error(
          "Another showroom already uses this slug or branch code"
        );
      }
    }

    Object.assign(existingShowroom, data);

    await existingShowroom.save();

    return existingShowroom;
  }

  static async updateShowroomStatus(
    id: string,
    isActive: boolean
  ) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid showroom ID");
    }

    const showroom = await Showroom.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true, runValidators: true }
    );

    if (!showroom) {
      throw new Error("Showroom not found");
    }

    return showroom;
  }

  static async deleteShowroom(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Invalid showroom ID");
    }

    const showroom = await Showroom.findByIdAndDelete(id);

    if (!showroom) {
      throw new Error("Showroom not found");
    }

    return showroom;
  }
}