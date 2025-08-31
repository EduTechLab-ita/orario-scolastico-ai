import { Teacher, Class, Subject, Room, Schedule } from '../types/scheduling';

export class DataValidator {
  static validateTeacher(teacher: Partial<Teacher>): string[] {
    const errors: string[] = [];

    if (!teacher.firstName?.trim()) {
      errors.push('Il nome è obbligatorio');
    }

    if (!teacher.lastName?.trim()) {
      errors.push('Il cognome è obbligatorio');
    }

    if (!teacher.email?.trim()) {
      errors.push('L\'email è obbligatoria');
    } else if (!this.isValidEmail(teacher.email)) {
      errors.push('L\'email non è valida');
    }

    if (!teacher.subjects || teacher.subjects.length === 0) {
      errors.push('Almeno una materia deve essere assegnata');
    }

    if (!teacher.maxHoursPerDay || teacher.maxHoursPerDay < 1 || teacher.maxHoursPerDay > 8) {
      errors.push('Le ore massime giornaliere devono essere tra 1 e 8');
    }

    if (!teacher.totalWeeklyHours || teacher.totalWeeklyHours < 1 || teacher.totalWeeklyHours > 40) {
      errors.push('Le ore settimanali totali devono essere tra 1 e 40');
    }

    return errors;
  }

  static validateClass(classItem: Partial<Class>): string[] {
    const errors: string[] = [];

    if (!classItem.name?.trim()) {
      errors.push('Il nome della classe è obbligatorio');
    }

    if (!classItem.section?.trim()) {
      errors.push('La sezione è obbligatoria');
    }

    if (!classItem.year || classItem.year < 1 || classItem.year > 8) {
      errors.push('L\'anno deve essere tra 1 e 8');
    }

    if (!classItem.studentsCount || classItem.studentsCount < 1 || classItem.studentsCount > 35) {
      errors.push('Il numero di studenti deve essere tra 1 e 35');
    }

    if (!classItem.plexId?.trim()) {
      errors.push('Il plesso è obbligatorio');
    }

    return errors;
  }

  static validateSubject(subject: Partial<Subject>): string[] {
    const errors: string[] = [];

    if (!subject.name?.trim()) {
      errors.push('Il nome della materia è obbligatorio');
    }

    if (!subject.code?.trim()) {
      errors.push('Il codice della materia è obbligatorio');
    }

    if (!subject.weeklyHours || Object.keys(subject.weeklyHours).length === 0) {
      errors.push('Almeno una classe deve avere ore settimanali assegnate');
    }

    // Validate weekly hours values
    if (subject.weeklyHours) {
      for (const [classId, hours] of Object.entries(subject.weeklyHours)) {
        if (hours < 0 || hours > 10) {
          errors.push(`Le ore settimanali per la classe ${classId} devono essere tra 0 e 10`);
        }
      }
    }

    return errors;
  }

  static validateRoom(room: Partial<Room>): string[] {
    const errors: string[] = [];

    if (!room.name?.trim()) {
      errors.push('Il nome dell\'aula è obbligatorio');
    }

    if (!room.type) {
      errors.push('Il tipo di aula è obbligatorio');
    }

    if (!room.capacity || room.capacity < 1 || room.capacity > 50) {
      errors.push('La capienza deve essere tra 1 e 50');
    }

    return errors;
  }

  static validateSchedule(schedule: Partial<Schedule>): string[] {
    const errors: string[] = [];

    if (!schedule.name?.trim()) {
      errors.push('Il nome dell\'orario è obbligatorio');
    }

    if (!schedule.entries || schedule.entries.length === 0) {
      errors.push('L\'orario deve contenere almeno una lezione');
    }

    return errors;
  }

  static validateTimeSlot(timeSlot: { day?: number; startTime?: string; endTime?: string }): string[] {
    const errors: string[] = [];

    if (timeSlot.day === undefined || timeSlot.day < 0 || timeSlot.day > 6) {
      errors.push('Il giorno deve essere tra 0 (Lunedì) e 6 (Domenica)');
    }

    if (!timeSlot.startTime) {
      errors.push('L\'ora di inizio è obbligatoria');
    } else if (!this.isValidTime(timeSlot.startTime)) {
      errors.push('L\'ora di inizio non è valida (formato HH:mm)');
    }

    if (!timeSlot.endTime) {
      errors.push('L\'ora di fine è obbligatoria');
    } else if (!this.isValidTime(timeSlot.endTime)) {
      errors.push('L\'ora di fine non è valida (formato HH:mm)');
    }

    if (timeSlot.startTime && timeSlot.endTime) {
      const start = this.timeToMinutes(timeSlot.startTime);
      const end = this.timeToMinutes(timeSlot.endTime);
      
      if (start >= end) {
        errors.push('L\'ora di fine deve essere successiva all\'ora di inizio');
      }

      if (end - start < 30) {
        errors.push('La durata minima di una lezione è 30 minuti');
      }

      if (end - start > 180) {
        errors.push('La durata massima di una lezione è 3 ore');
      }
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidTime(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static validateRequired(value: any, fieldName: string): string | null {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} è obbligatorio`;
    }
    return null;
  }

  static validateRange(value: number, min: number, max: number, fieldName: string): string | null {
    if (value < min || value > max) {
      return `${fieldName} deve essere tra ${min} e ${max}`;
    }
    return null;
  }

  static validateLength(value: string, minLength: number, maxLength: number, fieldName: string): string | null {
    if (value.length < minLength || value.length > maxLength) {
      return `${fieldName} deve essere tra ${minLength} e ${maxLength} caratteri`;
    }
    return null;
  }
}