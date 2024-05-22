import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateOfferingDto } from '../dto/create-offering.dto'; 

interface Offering {
  id: number;
  name: string;
}

@Injectable()
export class OfferingService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON;
    console.log(supabaseUrl, supabaseKey)
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and anon key must be provided');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
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

  async create(createOfferingDto: CreateOfferingDto): Promise<string> {
    console.log('createOfferingDto', createOfferingDto )
    const { status, data } = await this.supabase
      .from('offerings')
      .insert<CreateOfferingDto>([createOfferingDto])
      .select();
  
    if ( status !== 201 || !data || data.length === 0) {
      throw new InternalServerErrorException(
        `Failed to create offering: ${JSON.stringify(data)} with status ${status}`,
      );
    }
  
    return `Created offering: ${data[0].name}`;
  }
  
}
