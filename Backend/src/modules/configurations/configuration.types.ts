//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.types.ts
export interface SaveConfigurationRequest {
  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;
  
  engine: string;
  variant: string;

  basePrice: number;
  finalPrice: number;
}

export interface ConfigurationResponse {
  id: string;

  carId?: string;

  carSlug: string;
  carName: string;

  color: string;
  wheel: string;
  interior: string;
  
  engine: string;
  variant: string;  

  basePrice: number;
  finalPrice: number;

  status: string;

  createdAt: Date;
  updatedAt: Date;
}