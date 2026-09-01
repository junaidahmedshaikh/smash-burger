import { Request, Response, NextFunction } from 'express';
import { StoreSettings } from '../models/StoreSettings.model.js';
import { config } from '../config/index.js';
import { sendSuccess } from '../utils/response.js';

export class SettingsController {
  static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let settings = await StoreSettings.findOne();
      if (!settings) {
        settings = await StoreSettings.create({
          storeName: 'Smash Burger',
          tagline: 'Unapologetic Flavor. Smashed Fresh.',
          deliveryFee: config.store.deliveryFee,
          freeDeliveryThreshold: config.store.freeDeliveryThreshold,
          taxPercentage: config.store.taxPercentage,
          isOpen: true,
          locations: [
            {
              city: 'Mumbai',
              address: 'Bandra West, Linking Road, Mumbai, MH 400050',
              phone: '+91 98200 12345',
              openingHours: '11:00 AM – 02:00 AM',
              isActive: true,
            },
            {
              city: 'Bengaluru',
              address: 'Indiranagar 100ft Road, Bengaluru, KA 560038',
              phone: '+91 98450 67890',
              openingHours: '11:00 AM – 01:00 AM',
              isActive: true,
            },
            {
              city: 'Delhi NCR',
              address: 'CyberHub, DLF Phase 2, Gurugram, HR 122002',
              phone: '+91 98110 54321',
              openingHours: '11:00 AM – 03:00 AM',
              isActive: true,
            },
            {
              city: 'Hyderabad',
              address: 'Jubilee Hills Road No. 36, Hyderabad, TS 500033',
              phone: '+91 98660 98765',
              openingHours: '12:00 PM – 01:30 AM',
              isActive: true,
            },
          ],
        });
      }
      sendSuccess(res, settings, 'Store settings retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let settings = await StoreSettings.findOne();
      if (!settings) {
        settings = await StoreSettings.create(req.body);
      } else {
        Object.assign(settings, req.body);
        await settings.save();
      }
      sendSuccess(res, settings, 'Store settings updated');
    } catch (error) {
      next(error);
    }
  }
}
