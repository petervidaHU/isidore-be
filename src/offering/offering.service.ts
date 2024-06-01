import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateOfferingDto } from '../dto/create-offering.dto';
import { HuggingFaceAPI } from '../llm/huggingfaceApi';
import { Offering, OfferingResponse } from './offering.types';

@Injectable()
export class OfferingService {
  private supabase: SupabaseClient;
  private hf: HuggingFaceAPI;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and anon key must be provided');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.hf = new HuggingFaceAPI();
  }

  async getAll(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from<'offerings', Offering>('offerings')
      .select('*');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data || [];
  }
  async getAllActive(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from<'offerings', Offering>('offerings')
      .select('*')
      .filter('expiration', 'gt', new Date());

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data || [];
  }

  async create(input: CreateOfferingDto): Promise<OfferingResponse> {
    console.log('createOfferingDto', input)
    input.id = uuidv4();

    const { result: toxicResult, status: toxicStatus } = await this.hf.isToxic(input.description);

    if (toxicStatus === 'error') {
      throw new InternalServerErrorException(
        `Failed to create offering: ${input.description},  error: ${JSON.stringify(toxicResult)}`,
      );
    }

    if (toxicResult.isToxic) {
      throw new InternalServerErrorException(
        `Failed to create offering: ${input.description},  error: the description is toxic`,
      );
    }

    const { status, data, error } = await this.supabase
      .from('offerings')
      .insert<CreateOfferingDto>([input])
      .select();

    if (status !== 201 || !data || data.length === 0) {
      throw new InternalServerErrorException(
        `Failed to create offering: ${JSON.stringify(data)} with status ${status}, error: ${JSON.stringify(error)}`,
      );
    }
    let advise: string;
    if (input.description) {
      const { status: adviceStatus, result: adviseResult } = await this.hf.generateAdvice(input.description);
      advise = adviseResult.advise;
    }

    return {
      id: data[0].id,
      advised: advise,
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('offerings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
