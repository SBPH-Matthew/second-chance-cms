export interface Boost {
  id: number;
  item_type: 'product' | 'vehicle';
  item_id: number;
  seller_id: number;
  boost_type: 'premium' | 'featured' | 'top';
  duration_hours: number;
  cost: number;
  start_date?: string;
  end_date?: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
  seller?: any;
  payment?: Payment;
}

export interface Payment {
  id: number;
  boost_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  boost?: Boost;
}

export interface CreateBoostRequest {
  item_type: 'product' | 'vehicle';
  item_id: number;
  boost_type: 'premium' | 'featured' | 'top';
  duration_hours: number;
}

export interface UpdateBoostRequest {
  boost_type: 'premium' | 'featured' | 'top';
  duration_hours: number;
}

export interface BoostPricing {
  [boostType: string]: {
    [duration: number]: number;
  };
}