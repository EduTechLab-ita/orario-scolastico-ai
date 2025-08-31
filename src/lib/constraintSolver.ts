import { Schedule, ScheduleEntry, Constraint, ConstraintResult, ConstraintViolation } from '../types/scheduling';
import { generateId } from './utils';

export class ConstraintSolver {
  private constraints: Constraint[] = [];

  addConstraint(constraint: Constraint): void {
    this.constraints.push(constraint);
  }

  removeConstraint(constraintId: string): void {
    this.constraints = this.constraints.filter(c => c.id !== constraintId);
  }

  validateSchedule(schedule: Schedule): ConstraintResult {
    const violations: ConstraintViolation[] = [];
    let totalPenalty = 0;
    let isValid = true;

    for (const constraint of this.constraints.filter(c => c.isActive)) {
      const result = constraint.validator(schedule);
      
      if (!result.isValid) {
        violations.push(...result.violations);
        totalPenalty += result.penalty;
        
        if (constraint.type === 'hard') {
          isValid = false;
        }
      }
    }

    return {
      isValid,
      violations,
      penalty: totalPenalty
    };
  }

  getDefaultConstraints(): Constraint[] {
    return [
      {
        id: generateId(),
        name: 'Nessuna sovrapposizione docenti',
        type: 'hard',
        priority: 100,
        description: 'Un docente non può essere in due luoghi contemporaneamente',
        validator: this.validateTeacherOverlap.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Nessuna sovrapposizione aule',
        type: 'hard',
        priority: 100,
        description: 'Un\'aula non può ospitare due classi contemporaneamente',
        validator: this.validateRoomOverlap.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Nessuna sovrapposizione classi',
        type: 'hard',
        priority: 100,
        description: 'Una classe non può avere due lezioni contemporaneamente',
        validator: this.validateClassOverlap.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Rispetto disponibilità docenti',
        type: 'hard',
        priority: 90,
        description: 'I docenti devono essere disponibili negli orari assegnati',
        validator: this.validateTeacherAvailability.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Monte ore settimanale',
        type: 'hard',
        priority: 85,
        description: 'Deve essere rispettato il monte ore per ogni materia',
        validator: this.validateWeeklyHours.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Tempo di spostamento tra plessi',
        type: 'soft',
        priority: 70,
        description: 'Deve essere garantito tempo sufficiente per gli spostamenti',
        validator: this.validateTravelTime.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Distribuzione equilibrata materie',
        type: 'soft',
        priority: 60,
        description: 'Le materie dovrebbero essere distribuite uniformemente',
        validator: this.validateSubjectDistribution.bind(this),
        isActive: true
      },
      {
        id: generateId(),
        name: 'Evitare buchi nell\'orario',
        type: 'soft',
        priority: 50,
        description: 'Minimizzare le ore libere tra le lezioni',
        validator: this.validateScheduleCompactness.bind(this),
        isActive: true
      }
    ];
  }

  private validateTeacherOverlap(schedule: Schedule): ConstraintResult {
    const violations: ConstraintViolation[] = [];
    const teacherSlots = new Map<string, ScheduleEntry[]>();

    // Group entries by teacher
    for (const entry of schedule.entries) {
      if (!teacherSlots.has(entry.teacherId)) {
        teacherSlots.set(entry.teacherId, []);
      }
      teacherSlots.get(entry.teacherId)!.push(entry);
    }

    // Check for overlaps
    for (const [teacherId, entries] of teacherSlots) {
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          if (this.timeSlotsOverlap(entries[i].timeSlot, entries[j].timeSlot)) {
            violations.push({
              description: `Docente ${teacherId} ha sovrapposizioni orarie`,
              severity: 'high',
              affectedEntries: [entries[i].id, entries[j].id]
            });
          }
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      penalty: violations.length * 100
    };
  }

  private validateRoomOverlap(schedule: Schedule): ConstraintResult {
    const violations: ConstraintViolation[] = [];
    const roomSlots = new Map<string, ScheduleEntry[]>();

    // Group entries by room
    for (const entry of schedule.entries) {
      if (!roomSlots.has(entry.roomId)) {
        roomSlots.set(entry.roomId, []);
      }
      roomSlots.get(entry.roomId)!.push(entry);
    }

    // Check for overlaps
    for (const [roomId, entries] of roomSlots) {
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          if (this.timeSlotsOverlap(entries[i].timeSlot, entries[j].timeSlot)) {
            violations.push({
              description: `Aula ${roomId} ha sovrapposizioni orarie`,
              severity: 'high',
              affectedEntries: [entries[i].id, entries[j].id]
            });
          }
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      penalty: violations.length * 100
    };
  }

  private validateClassOverlap(schedule: Schedule): ConstraintResult {
    const violations: ConstraintViolation[] = [];
    const classSlots = new Map<string, ScheduleEntry[]>();

    // Group entries by class
    for (const entry of schedule.entries) {
      if (!classSlots.has(entry.classId)) {
        classSlots.set(entry.classId, []);
      }
      classSlots.get(entry.classId)!.push(entry);
    }

    // Check for overlaps
    for (const [classId, entries] of classSlots) {
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          if (this.timeSlotsOverlap(entries[i].timeSlot, entries[j].timeSlot)) {
            violations.push({
              description: `Classe ${classId} ha sovrapposizioni orarie`,
              severity: 'high',
              affectedEntries: [entries[i].id, entries[j].id]
            });
          }
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      penalty: violations.length * 100
    };
  }

  private validateTeacherAvailability(schedule: Schedule): ConstraintResult {
    // Implementation would check teacher availability constraints
    return { isValid: true, violations: [], penalty: 0 };
  }

  private validateWeeklyHours(schedule: Schedule): ConstraintResult {
    // Implementation would validate weekly hour requirements
    return { isValid: true, violations: [], penalty: 0 };
  }

  private validateTravelTime(schedule: Schedule): ConstraintResult {
    // Implementation would validate travel time between plexes
    return { isValid: true, violations: [], penalty: 0 };
  }

  private validateSubjectDistribution(schedule: Schedule): ConstraintResult {
    // Implementation would check subject distribution
    return { isValid: true, violations: [], penalty: 0 };
  }

  private validateScheduleCompactness(schedule: Schedule): ConstraintResult {
    // Implementation would check for gaps in schedules
    return { isValid: true, violations: [], penalty: 0 };
  }

  private timeSlotsOverlap(slot1: { day: number; startTime: string; endTime: string }, slot2: { day: number; startTime: string; endTime: string }): boolean {
    if (slot1.day !== slot2.day) return false;
    
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}