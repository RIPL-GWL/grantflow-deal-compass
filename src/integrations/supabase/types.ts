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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          audience: string
          body: string
          created_at: string
          id: string
          published_at: string
          title: string
        }
        Insert: {
          audience?: string
          body: string
          created_at?: string
          id?: string
          published_at?: string
          title: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          published_at?: string
          title?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          created_at: string
          designation: string | null
          email: string | null
          gstin: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
        }
        Relationships: []
      }
      crm_deal_activities: {
        Row: {
          body: string
          created_at: string
          deal_id: string
          id: string
          kind: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deal_id: string
          id?: string
          kind?: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          deal_id?: string
          id?: string
          kind?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_deal_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          closed_at: string | null
          company: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          expected_close: string | null
          followup_note: string | null
          id: string
          lead_id: string | null
          next_followup_at: string | null
          notes: string | null
          owner_id: string
          partner_id: string | null
          phone: string | null
          pipeline: string
          stage: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          closed_at?: string | null
          company?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          expected_close?: string | null
          followup_note?: string | null
          id?: string
          lead_id?: string | null
          next_followup_at?: string | null
          notes?: string | null
          owner_id?: string
          partner_id?: string | null
          phone?: string | null
          pipeline?: string
          stage?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          closed_at?: string | null
          company?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          expected_close?: string | null
          followup_note?: string | null
          id?: string
          lead_id?: string | null
          next_followup_at?: string | null
          notes?: string | null
          owner_id?: string
          partner_id?: string | null
          phone?: string | null
          pipeline?: string
          stage?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_documents: {
        Row: {
          created_at: string
          deal_id: string
          file_path: string
          id: string
          name: string
          size_bytes: number | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          file_path: string
          id?: string
          name: string
          size_bytes?: number | null
          uploaded_by?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          file_path?: string
          id?: string
          name?: string
          size_bytes?: number | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean
          key: string
          members: string[]
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          key: string
          members?: string[]
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          key?: string
          members?: string[]
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      crm_quotes: {
        Row: {
          created_at: string
          created_by: string
          deal_id: string
          discount: number
          gst_percent: number
          id: string
          items: Json
          notes: string | null
          number: string
          quote_number: string
          status: string
          terms: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          deal_id: string
          discount?: number
          gst_percent?: number
          id?: string
          items?: Json
          notes?: string | null
          number?: string
          quote_number?: string
          status?: string
          terms?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deal_id?: string
          discount?: number
          gst_percent?: number
          id?: string
          items?: Json
          notes?: string | null
          number?: string
          quote_number?: string
          status?: string
          terms?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_quotes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_targets: {
        Row: {
          created_at: string
          id: string
          month: string
          target_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month: string
          target_value: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month?: string
          target_value?: number
          user_id?: string
        }
        Relationships: []
      }
      directory_profiles: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_published: boolean
          kind: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_published?: boolean
          kind: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_published?: boolean
          kind?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          date_of_joining: string | null
          department: string
          designation: string
          employee_code: string
          employee_id: string
          full_name: string
          id: string
          is_active: boolean
          official_email: string | null
          user_id: string | null
          work_location: string
        }
        Insert: {
          created_at?: string
          date_of_joining?: string | null
          department: string
          designation: string
          employee_code: string
          employee_id: string
          full_name: string
          id?: string
          is_active?: boolean
          official_email?: string | null
          user_id?: string | null
          work_location: string
        }
        Update: {
          created_at?: string
          date_of_joining?: string | null
          department?: string
          designation?: string
          employee_code?: string
          employee_id?: string
          full_name?: string
          id?: string
          is_active?: boolean
          official_email?: string | null
          user_id?: string | null
          work_location?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          lead_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind?: string
          lead_id: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          lead_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          details: Json
          email: string
          id: string
          lead_type: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          details?: Json
          email: string
          id?: string
          lead_type: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          details?: Json
          email?: string
          id?: string
          lead_type?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string
          created_at: string
          email: string
          full_name: string | null
          id: string
          reviewed_at: string | null
        }
        Insert: {
          approval_status?: string
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          reviewed_at?: string | null
        }
        Update: {
          approval_status?: string
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      programme_applications: {
        Row: {
          ai_recommendation: string | null
          amount_paid: number
          assigned_to: string | null
          city: string | null
          created_at: string
          email: string
          founder_name: string
          funding_interest: string
          funding_need: number
          id: string
          idea: string
          notes: string | null
          participants: number
          payment_status: string
          phone: string
          stage: string
          startup_name: string
          status: string
          updated_at: string
        }
        Insert: {
          ai_recommendation?: string | null
          amount_paid?: number
          assigned_to?: string | null
          city?: string | null
          created_at?: string
          email: string
          founder_name: string
          funding_interest: string
          funding_need?: number
          id?: string
          idea: string
          notes?: string | null
          participants?: number
          payment_status?: string
          phone: string
          stage: string
          startup_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          ai_recommendation?: string | null
          amount_paid?: number
          assigned_to?: string | null
          city?: string | null
          created_at?: string
          email?: string
          founder_name?: string
          funding_interest?: string
          funding_need?: number
          id?: string
          idea?: string
          notes?: string | null
          participants?: number
          payment_status?: string
          phone?: string
          stage?: string
          startup_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_team_members: {
        Row: {
          manager_id: string | null
          team_leader_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          manager_id?: string | null
          team_leader_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          manager_id?: string | null
          team_leader_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          data: Json
          key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          data: Json
          key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          data?: Json
          key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      staff_assignments: {
        Row: {
          created_at: string
          id: string
          lead_types: string[]
          priority: number
          states: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_types?: string[]
          priority?: number
          states?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_types?: string[]
          priority?: number
          states?: string[]
          user_id?: string
        }
        Relationships: []
      }
      store_network: {
        Row: {
          area: string
          district: string
          id: string
          is_visible: boolean
          sort_order: number
          state: string
          stores: number
          updated_at: string
        }
        Insert: {
          area?: string
          district: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          state: string
          stores?: number
          updated_at?: string
        }
        Update: {
          area?: string
          district?: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          state?: string
          stores?: number
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          area: string | null
          created_at: string
          district: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          state: string
          store_type: string
        }
        Insert: {
          address?: string | null
          area?: string | null
          created_at?: string
          district?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          state: string
          store_type?: string
        }
        Update: {
          address?: string | null
          area?: string | null
          created_at?: string
          district?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          state?: string
          store_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_deal: { Args: { _deal_id: string }; Returns: boolean }
      can_manage_leads: { Args: { _user_id: string }; Returns: boolean }
      can_see_deal: { Args: { _deal_id: string }; Returns: boolean }
      can_view_sales: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_programme_team: { Args: { _user_id: string }; Returns: boolean }
      is_sales_manager: { Args: { _user_id: string }; Returns: boolean }
      is_sales_staff: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      leads_team_of: {
        Args: { _member: string; _viewer: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "lead_manager"
        | "sales_executive"
        | "store_manager"
        | "funding_manager"
        | "global_manager"
        | "content_editor"
        | "hr_manager"
        | "viewer"
        | "partner"
        | "programme_manager"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "lead_manager",
        "sales_executive",
        "store_manager",
        "funding_manager",
        "global_manager",
        "content_editor",
        "hr_manager",
        "viewer",
        "partner",
        "programme_manager",
      ],
    },
  },
} as const
