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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          activity_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      counselor_applications: {
        Row: {
          created_at: string
          experience: string | null
          id: string
          motivation: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          experience?: string | null
          id?: string
          motivation: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          experience?: string | null
          id?: string
          motivation?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          is_published: boolean | null
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_published?: boolean | null
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_published?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_forms: {
        Row: {
          cause: string | null
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          email: string
          feelings: string | null
          id: string
          is_claimed: boolean | null
          mood: Database["public"]["Enums"]["mood_type"]
          name: string
          phone: string
          proposed_solution: string | null
          user_id: string | null
        }
        Insert: {
          cause?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email: string
          feelings?: string | null
          id?: string
          is_claimed?: boolean | null
          mood: Database["public"]["Enums"]["mood_type"]
          name: string
          phone: string
          proposed_solution?: string | null
          user_id?: string | null
        }
        Update: {
          cause?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email?: string
          feelings?: string | null
          id?: string
          is_claimed?: boolean | null
          mood?: Database["public"]["Enums"]["mood_type"]
          name?: string
          phone?: string
          proposed_solution?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          lessons_attended: number | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lessons_attended?: number | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          lessons_attended?: number | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qa_threads: {
        Row: {
          created_at: string
          id: string
          is_public: boolean | null
          question: string
          replied_at: string | null
          replied_by: string | null
          reply: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          question: string
          replied_at?: string | null
          replied_by?: string | null
          reply?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          question?: string
          replied_at?: string | null
          replied_by?: string | null
          reply?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          counselor_id: string | null
          created_at: string
          description: string | null
          id: string
          notes: string | null
          preferred_date: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          counselor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          counselor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          title?: string
          updated_at?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      vlogs: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_counselor: { Args: { _user_id: string }; Returns: boolean }
      is_executive: { Args: { _user_id: string }; Returns: boolean }
      is_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "member" | "counselor" | "executive"
      application_status: "pending" | "approved" | "rejected"
      mood_type:
        | "happy"
        | "sad"
        | "anxious"
        | "stressed"
        | "confused"
        | "hopeful"
        | "angry"
        | "neutral"
      session_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
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
    Enums: {
      app_role: ["member", "counselor", "executive"],
      application_status: ["pending", "approved", "rejected"],
      mood_type: [
        "happy",
        "sad",
        "anxious",
        "stressed",
        "confused",
        "hopeful",
        "angry",
        "neutral",
      ],
      session_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
