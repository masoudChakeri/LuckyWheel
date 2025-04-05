import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prize } from '../wheel/entities/prize.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) {}

  async onModuleInit() {
    const existingPrizes = await this.prizeRepository.find();
    if (existingPrizes.length === 0) {
      await this.seedAdmin();
    }
  }

  private async seedAdmin() {
    const prize1 = this.prizeRepository.create({
      name: "کد تخفیف ۲۰ درصدی خرید اشتراک حبل المتین",
      weight: 1,
      justOnce: true,
      score: 0,
    });      
    
    const prize2 = this.prizeRepository.create({
      name: " کد تخفیف ۵۰ درصدی خرید اشتراک حبل المتین",
      weight: 0.8,
      justOnce: true,
      score: 0,
    });      
    
    const prize3 = this.prizeRepository.create({
      name: " شانس شرکت در قرعه کشی آخر ماه",
      weight: 2.5,
      justOnce: false,
      score: 1,
    });    
    
    const prize4 = this.prizeRepository.create({
      name: "۳ شانس شرکت در قرعه کشی آخر ماه",
      weight: 1.5,
      justOnce: false,
      score: 3,
    });    
    
    const prize5 = this.prizeRepository.create({
      name: "مبلغ ۲ میلیون تومان جایزه نقدی",
      weight: 0.2,
      justOnce: true,
      score: 0,
    });  
    
    const prize6 = this.prizeRepository.create({
      name: "کد تخفیف ۳۰ درصدی خرید از دیجیکالا",
      weight: 1.5,
      justOnce: true,
      score: 0,
    });  
        
    const prize7 = this.prizeRepository.create({
      name: "کد تخفیف ۳۰ درصدی خرید از طلاسی",
      weight: 1.5,
      justOnce: true,
      score: 0,
    });

    await this.prizeRepository.save([prize1, prize2, prize3, prize4, prize5, prize6, prize7]);
  }
}