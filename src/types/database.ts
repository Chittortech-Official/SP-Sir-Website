export type AvailabilityStatus = 
  | 'available'             // आज जनसुनवाई के लिए उपलब्ध
  | 'unavailable'           // आज जनसुनवाई के लिए उपलब्ध नहीं
  | 'confirmation_pending'  // समय की पुष्टि बाकी है
  | 'time_changed';         // जनसुनवाई का समय बदल गया है

export type TimingType = 'confirmed' | 'tentative';
export type SlotStatus = 'confirmed' | 'tentative' | 'cancelled';
export type NoticePriority = 'high' | 'normal' | 'urgent';

export interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email?: string;
  photo_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface AvailabilitySlot {
  id: string;
  availability_id: string;
  start_time: string;
  end_time: string;
  slot_status: SlotStatus;
  slot_label: string;
  display_order: number;
}

export interface Availability {
  id: string;
  schedule_date: string;
  status: AvailabilityStatus;
  timing_type: TimingType;
  public_message: string;
  alternative_officer_id: string | null;
  alternative_timing?: string;
  published: boolean;
  updated_at: string;
  updated_by: string;
  slots?: AvailabilitySlot[];
  alternative_officer?: OfficerProfile;
}

export interface PublicNotice {
  id: string;
  title: string;
  message: string;
  published: boolean;
  priority: NoticePriority;
  publish_at: string;
  expires_at?: string;
  created_at: string;
  updated_at?: string;
}

export type DirectoryCategory = 'senior' | 'circle' | 'station' | 'branch' | 'outpost';

export interface PoliceDirectoryRecord {
  id: string;
  name: string;
  post: string;
  category: DirectoryCategory;
  circle_name?: string | null;
  location?: string | null;
  std_code?: string | null;
  office_phone?: string | null;
  residence_phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  alt_email?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user: string;
  action: string;
  record_type: string;
  details: string;
  created_at: string;
}

