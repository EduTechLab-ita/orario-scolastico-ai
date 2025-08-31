export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  availability: TimeSlot[];
  preferences: TeacherPreferences;
  travelTime: { [plexId: string]: number }; // minutes between plexes
  maxHoursPerDay: number;
  totalWeeklyHours: number;
}

export interface TeacherPreferences {
  preferredTimeSlots: TimeSlot[];
  avoidedTimeSlots: TimeSlot[];
  preferredClasses: string[];
  maxConsecutiveHours: number;
  preferredDays: number[]; // 0-6, Monday-Sunday
}

export interface Class {
  id: string;
  name: string;
  section: string;
  year: number;
  studentsCount: number;
  plexId: string;
  schedule: ClassSchedule;
  specialNeeds: string[];
}

export interface ClassSchedule {
  type: 'normal' | 'extended'; // tempo normale o prolungato
  afternoonSessions: boolean;
  lunchBreak?: TimeSlot;
  maxHoursPerDay: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  weeklyHours: { [classId: string]: number };
  requiresSpecialRoom: boolean;
  specialRoomType?: string;
  canBeSplit: boolean; // can be divided into multiple sessions
  requiresContinuity: boolean; // needs consecutive hours
}

export interface Plex {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
  travelTimeToOtherPlexes: { [plexId: string]: number };
}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'gym' | 'library' | 'special';
  capacity: number;
  equipment: string[];
  availability: TimeSlot[];
}

export interface TimeSlot {
  day: number; // 0-6, Monday-Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface ScheduleEntry {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  roomId: string;
  timeSlot: TimeSlot;
  type: 'regular' | 'substitution' | 'support';
}

export interface Schedule {
  id: string;
  name: string;
  entries: ScheduleEntry[];
  createdAt: Date;
  lastModified: Date;
  isActive: boolean;
  fitnessScore?: number;
  conflicts: Conflict[];
}

export interface Conflict {
  id: string;
  type: 'teacher_overlap' | 'room_overlap' | 'class_overlap' | 'constraint_violation';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedEntries: string[];
  suggestedResolution?: string;
}

export interface Constraint {
  id: string;
  name: string;
  type: 'hard' | 'soft';
  priority: number;
  description: string;
  validator: (schedule: Schedule) => ConstraintResult;
  isActive: boolean;
}

export interface ConstraintResult {
  isValid: boolean;
  violations: ConstraintViolation[];
  penalty: number;
}

export interface ConstraintViolation {
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedEntries: string[];
}

export interface OptimizationSettings {
  maxGenerations: number;
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
  convergenceThreshold: number;
  maxRuntime: number; // seconds
}

export interface ScheduleMetrics {
  totalConflicts: number;
  hardConstraintViolations: number;
  softConstraintViolations: number;
  teacherSatisfaction: number;
  roomUtilization: number;
  travelOptimization: number;
  overallScore: number;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'json';
  includeTeachers: boolean;
  includeRooms: boolean;
  includeConflicts: boolean;
  groupBy: 'class' | 'teacher' | 'room';
}