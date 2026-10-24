//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.types.ts
export interface BookTestDriveRequest {
  carId?: string;

  carSlug: string;
  carName: string;

  fullName: string;
  email: string;
  mobile: string;

  date: string;
  time: string;

  location: string;

  notes?: string;
}