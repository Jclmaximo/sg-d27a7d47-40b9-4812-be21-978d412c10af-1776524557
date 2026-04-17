 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          business_name: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          whatsapp_number: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          whatsapp_number: string
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount_usd: number
          commission_level: number
          created_at: string | null
          id: string
          paid_at: string | null
          percentage: number
          referred_user_id: string
          status: string
          subscription_id: string
          user_id: string
        }
        Insert: {
          amount_usd: number
          commission_level: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          percentage: number
          referred_user_id: string
          status?: string
          subscription_id: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          commission_level?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          percentage?: number
          referred_user_id?: string
          status?: string
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_percentage: number
          id: string
          is_active: boolean | null
          times_used: number | null
          updated_at: string | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_percentage: number
          id?: string
          is_active?: boolean | null
          times_used?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_percentage?: number
          id?: string
          is_active?: boolean | null
          times_used?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          lead_id: string
          note: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id: string
          note: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          country: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          source: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          created_at: string | null
          id: string
          name: string
          template: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          template: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          template?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          discount_code_used: string | null
          id: string
          network: string
          payment_address: string | null
          payment_id: string
          provider: string
          status: string
          transaction_hash: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          discount_code_used?: string | null
          id?: string
          network?: string
          payment_address?: string | null
          payment_id: string
          provider?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          discount_code_used?: string | null
          id?: string
          network?: string
          payment_address?: string | null
          payment_id?: string
          provider?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ambassador_active: boolean | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          referred_by: string | null
          role: string | null
          updated_at: string | null
          usdt_wallet_address: string | null
          username: string | null
          whatsapp_number: string | null
        }
        Insert: {
          ambassador_active?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          referred_by?: string | null
          role?: string | null
          updated_at?: string | null
          usdt_wallet_address?: string | null
          username?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          ambassador_active?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          referred_by?: string | null
          role?: string | null
          updated_at?: string | null
          usdt_wallet_address?: string | null
          username?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          discount_code_used: string | null
          discount_percentage: number | null
          end_date: string | null
          final_price: number | null
          id: string
          initial_payment_amount: number | null
          is_initial_payment: boolean | null
          monthly_payment_amount: number | null
          original_price: number | null
          payment_method: string
          plan_type: string
          price_usd: number
          start_date: string | null
          status: string
          transaction_hash: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          discount_code_used?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          final_price?: number | null
          id?: string
          initial_payment_amount?: number | null
          is_initial_payment?: boolean | null
          monthly_payment_amount?: number | null
          original_price?: number | null
          payment_method?: string
          plan_type?: string
          price_usd: number
          start_date?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          discount_code_used?: string | null
          discount_percentage?: number | null
          end_date?: string | null
          final_price?: number | null
          id?: string
          initial_payment_amount?: number | null
          is_initial_payment?: boolean | null
          monthly_payment_amount?: number | null
          original_price?: number | null
          payment_method?: string
          plan_type?: string
          price_usd?: number
          start_date?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
