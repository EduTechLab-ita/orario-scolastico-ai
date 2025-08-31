import { Schedule, ScheduleEntry, Teacher, Class, Subject, Room, TimeSlot, Conflict, OptimizationSettings, ScheduleMetrics } from '../types/scheduling';
import { generateId } from './utils';

export class AIScheduleOptimizer {
  private teachers: Teacher[];
  private classes: Class[];
  private subjects: Subject[];
  private rooms: Room[];
  private constraints: any[];
  private settings: OptimizationSettings;

  constructor(
    teachers: Teacher[],
    classes: Class[],
    subjects: Subject[],
    rooms: Room[],
    settings: OptimizationSettings
  ) {
    this.teachers = teachers;
    this.classes = classes;
    this.subjects = subjects;
    this.rooms = rooms;
    this.constraints = [];
    this.settings = settings;
  }

  async generateOptimalSchedule(onProgress?: (progress: number) => void): Promise<Schedule> {
    const startTime = Date.now();
    let population = this.initializePopulation();
    let generation = 0;
    let bestSchedule = population[0];
    let bestFitness = this.evaluateFitness(bestSchedule);

    while (generation < this.settings.maxGenerations) {
      // Report progress
      const progress = (generation / this.settings.maxGenerations) * 100;
      onProgress?.(progress);

      // Evaluate fitness for all individuals
      const fitnessScores = population.map(schedule => ({
        schedule,
        fitness: this.evaluateFitness(schedule)
      }));

      // Sort by fitness (higher is better)
      fitnessScores.sort((a, b) => b.fitness - a.fitness);

      // Update best schedule if improved
      if (fitnessScores[0].fitness > bestFitness) {
        bestSchedule = fitnessScores[0].schedule;
        bestFitness = fitnessScores[0].fitness;
      }

      // Check convergence
      if (bestFitness >= this.settings.convergenceThreshold) {
        break;
      }

      // Check runtime limit
      if ((Date.now() - startTime) / 1000 > this.settings.maxRuntime) {
        break;
      }

      // Create next generation
      const newPopulation: Schedule[] = [];

      // Elitism: keep best individuals
      const eliteCount = Math.floor(this.settings.populationSize * this.settings.elitismRate);
      for (let i = 0; i < eliteCount; i++) {
        newPopulation.push(this.cloneSchedule(fitnessScores[i].schedule));
      }

      // Generate offspring through crossover and mutation
      while (newPopulation.length < this.settings.populationSize) {
        const parent1 = this.selectParent(fitnessScores);
        const parent2 = this.selectParent(fitnessScores);
        
        let offspring = this.crossover(parent1, parent2);
        
        if (Math.random() < this.settings.mutationRate) {
          offspring = this.mutate(offspring);
        }

        newPopulation.push(offspring);
      }

      population = newPopulation;
      generation++;
    }

    // Finalize best schedule
    bestSchedule.fitnessScore = bestFitness;
    bestSchedule.conflicts = this.detectConflicts(bestSchedule);
    
    onProgress?.(100);
    return bestSchedule;
  }

  private initializePopulation(): Schedule[] {
    const population: Schedule[] = [];
    
    for (let i = 0; i < this.settings.populationSize; i++) {
      const schedule = this.createRandomSchedule();
      population.push(schedule);
    }
    
    return population;
  }

  private createRandomSchedule(): Schedule {
    const entries: ScheduleEntry[] = [];
    const timeSlots = this.generateTimeSlots();

    // For each class and subject combination
    for (const classItem of this.classes) {
      for (const subject of this.subjects) {
        const weeklyHours = subject.weeklyHours[classItem.id] || 0;
        
        if (weeklyHours > 0) {
          const availableTeachers = this.teachers.filter(t => 
            t.subjects.includes(subject.id)
          );

          if (availableTeachers.length === 0) continue;

          // Distribute hours across the week
          let remainingHours = weeklyHours;
          let attempts = 0;
          const maxAttempts = 100;

          while (remainingHours > 0 && attempts < maxAttempts) {
            const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
            const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            const room = this.findAvailableRoom(subject, timeSlot, entries);

            if (room && this.isSlotAvailable(teacher, classItem, timeSlot, entries)) {
              entries.push({
                id: generateId(),
                teacherId: teacher.id,
                classId: classItem.id,
                subjectId: subject.id,
                roomId: room.id,
                timeSlot,
                type: 'regular'
              });
              remainingHours--;
            }
            attempts++;
          }
        }
      }
    }

    return {
      id: generateId(),
      name: `Generated Schedule ${Date.now()}`,
      entries,
      createdAt: new Date(),
      lastModified: new Date(),
      isActive: false,
      conflicts: []
    };
  }

  private generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const days = [0, 1, 2, 3, 4, 5]; // Monday to Saturday
    const hours = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];

    for (const day of days) {
      for (const hour of hours) {
        slots.push({
          day,
          startTime: hour.start,
          endTime: hour.end
        });
      }
    }

    return slots;
  }

  private evaluateFitness(schedule: Schedule): number {
    let score = 1000; // Start with perfect score
    
    // Penalize conflicts
    const conflicts = this.detectConflicts(schedule);
    score -= conflicts.length * 50;

    // Reward teacher preference satisfaction
    score += this.evaluateTeacherPreferences(schedule) * 100;

    // Reward optimal room utilization
    score += this.evaluateRoomUtilization(schedule) * 50;

    // Penalize travel time violations
    score -= this.evaluateTravelViolations(schedule) * 30;

    // Reward schedule compactness
    score += this.evaluateScheduleCompactness(schedule) * 25;

    return Math.max(0, score);
  }

  private detectConflicts(schedule: Schedule): Conflict[] {
    const conflicts: Conflict[] = [];
    const entries = schedule.entries;

    // Check for teacher conflicts
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const entry1 = entries[i];
        const entry2 = entries[j];

        if (this.timeSlotsOverlap(entry1.timeSlot, entry2.timeSlot)) {
          // Teacher conflict
          if (entry1.teacherId === entry2.teacherId) {
            conflicts.push({
              id: generateId(),
              type: 'teacher_overlap',
              severity: 'high',
              description: `Docente ${entry1.teacherId} ha sovrapposizioni orarie`,
              affectedEntries: [entry1.id, entry2.id]
            });
          }

          // Room conflict
          if (entry1.roomId === entry2.roomId) {
            conflicts.push({
              id: generateId(),
              type: 'room_overlap',
              severity: 'high',
              description: `Aula ${entry1.roomId} ha sovrapposizioni orarie`,
              affectedEntries: [entry1.id, entry2.id]
            });
          }

          // Class conflict
          if (entry1.classId === entry2.classId) {
            conflicts.push({
              id: generateId(),
              type: 'class_overlap',
              severity: 'high',
              description: `Classe ${entry1.classId} ha sovrapposizioni orarie`,
              affectedEntries: [entry1.id, entry2.id]
            });
          }
        }
      }
    }

    return conflicts;
  }

  private timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
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

  private crossover(parent1: Schedule, parent2: Schedule): Schedule {
    const offspring: Schedule = {
      id: generateId(),
      name: `Crossover ${Date.now()}`,
      entries: [],
      createdAt: new Date(),
      lastModified: new Date(),
      isActive: false,
      conflicts: []
    };

    // Single-point crossover
    const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.entries.length, parent2.entries.length));
    
    offspring.entries = [
      ...parent1.entries.slice(0, crossoverPoint),
      ...parent2.entries.slice(crossoverPoint)
    ];

    // Remove duplicates and conflicts
    offspring.entries = this.removeDuplicateEntries(offspring.entries);
    
    return offspring;
  }

  private mutate(schedule: Schedule): Schedule {
    const mutated = this.cloneSchedule(schedule);
    const mutationCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < mutationCount; i++) {
      if (mutated.entries.length === 0) break;
      
      const entryIndex = Math.floor(Math.random() * mutated.entries.length);
      const entry = mutated.entries[entryIndex];
      
      // Randomly mutate one aspect of the entry
      const mutationType = Math.floor(Math.random() * 3);
      
      switch (mutationType) {
        case 0: // Change time slot
          const newTimeSlots = this.generateTimeSlots();
          entry.timeSlot = newTimeSlots[Math.floor(Math.random() * newTimeSlots.length)];
          break;
        case 1: // Change room
          const availableRooms = this.rooms.filter(r => 
            this.isRoomSuitableForSubject(r, entry.subjectId)
          );
          if (availableRooms.length > 0) {
            entry.roomId = availableRooms[Math.floor(Math.random() * availableRooms.length)].id;
          }
          break;
        case 2: // Change teacher (if multiple available)
          const availableTeachers = this.teachers.filter(t => 
            t.subjects.includes(entry.subjectId)
          );
          if (availableTeachers.length > 1) {
            const otherTeachers = availableTeachers.filter(t => t.id !== entry.teacherId);
            if (otherTeachers.length > 0) {
              entry.teacherId = otherTeachers[Math.floor(Math.random() * otherTeachers.length)].id;
            }
          }
          break;
      }
    }

    return mutated;
  }

  private selectParent(fitnessScores: { schedule: Schedule; fitness: number }[]): Schedule {
    // Tournament selection
    const tournamentSize = 3;
    const tournament = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * fitnessScores.length);
      tournament.push(fitnessScores[randomIndex]);
    }
    
    tournament.sort((a, b) => b.fitness - a.fitness);
    return tournament[0].schedule;
  }

  private cloneSchedule(schedule: Schedule): Schedule {
    return {
      ...schedule,
      id: generateId(),
      entries: schedule.entries.map(entry => ({ ...entry, id: generateId() })),
      createdAt: new Date(),
      lastModified: new Date()
    };
  }

  private removeDuplicateEntries(entries: ScheduleEntry[]): ScheduleEntry[] {
    const seen = new Set<string>();
    return entries.filter(entry => {
      const key = `${entry.classId}-${entry.timeSlot.day}-${entry.timeSlot.startTime}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private findAvailableRoom(subject: Subject, timeSlot: TimeSlot, existingEntries: ScheduleEntry[]): Room | null {
    const suitableRooms = this.rooms.filter(room => 
      this.isRoomSuitableForSubject(room, subject.id)
    );

    for (const room of suitableRooms) {
      const isOccupied = existingEntries.some(entry => 
        entry.roomId === room.id && 
        this.timeSlotsOverlap(entry.timeSlot, timeSlot)
      );

      if (!isOccupied) {
        return room;
      }
    }

    return null;
  }

  private isRoomSuitableForSubject(room: Room, subjectId: string): boolean {
    const subject = this.subjects.find(s => s.id === subjectId);
    if (!subject) return false;

    if (subject.requiresSpecialRoom) {
      return room.type === subject.specialRoomType;
    }

    return room.type === 'classroom' || room.type === 'special';
  }

  private isSlotAvailable(teacher: Teacher, classItem: Class, timeSlot: TimeSlot, existingEntries: ScheduleEntry[]): boolean {
    // Check teacher availability
    const teacherConflict = existingEntries.some(entry => 
      entry.teacherId === teacher.id && 
      this.timeSlotsOverlap(entry.timeSlot, timeSlot)
    );

    // Check class availability
    const classConflict = existingEntries.some(entry => 
      entry.classId === classItem.id && 
      this.timeSlotsOverlap(entry.timeSlot, timeSlot)
    );

    return !teacherConflict && !classConflict;
  }

  private evaluateTeacherPreferences(schedule: Schedule): number {
    let satisfactionScore = 0;
    let totalPreferences = 0;

    for (const teacher of this.teachers) {
      const teacherEntries = schedule.entries.filter(e => e.teacherId === teacher.id);
      
      for (const entry of teacherEntries) {
        totalPreferences++;
        
        // Check if time slot matches preferences
        const isPreferred = teacher.preferences.preferredTimeSlots.some(pref =>
          this.timeSlotsOverlap(entry.timeSlot, pref)
        );
        
        const isAvoided = teacher.preferences.avoidedTimeSlots.some(avoid =>
          this.timeSlotsOverlap(entry.timeSlot, avoid)
        );

        if (isPreferred) satisfactionScore += 1;
        if (isAvoided) satisfactionScore -= 0.5;
      }
    }

    return totalPreferences > 0 ? satisfactionScore / totalPreferences : 0;
  }

  private evaluateRoomUtilization(schedule: Schedule): number {
    const roomUsage = new Map<string, number>();
    
    for (const room of this.rooms) {
      roomUsage.set(room.id, 0);
    }

    for (const entry of schedule.entries) {
      roomUsage.set(entry.roomId, (roomUsage.get(entry.roomId) || 0) + 1);
    }

    const utilizationRates = Array.from(roomUsage.values());
    const avgUtilization = utilizationRates.reduce((a, b) => a + b, 0) / utilizationRates.length;
    const variance = utilizationRates.reduce((acc, rate) => acc + Math.pow(rate - avgUtilization, 2), 0) / utilizationRates.length;
    
    // Lower variance means better distribution
    return Math.max(0, 1 - variance / 100);
  }

  private evaluateTravelViolations(schedule: Schedule): number {
    let violations = 0;

    for (const teacher of this.teachers) {
      const teacherEntries = schedule.entries
        .filter(e => e.teacherId === teacher.id)
        .sort((a, b) => {
          if (a.timeSlot.day !== b.timeSlot.day) {
            return a.timeSlot.day - b.timeSlot.day;
          }
          return this.timeToMinutes(a.timeSlot.startTime) - this.timeToMinutes(b.timeSlot.startTime);
        });

      for (let i = 0; i < teacherEntries.length - 1; i++) {
        const current = teacherEntries[i];
        const next = teacherEntries[i + 1];

        if (current.timeSlot.day === next.timeSlot.day) {
          const currentRoom = this.rooms.find(r => r.id === current.roomId);
          const nextRoom = this.rooms.find(r => r.id === next.roomId);
          
          if (currentRoom && nextRoom) {
            const timeBetween = this.timeToMinutes(next.timeSlot.startTime) - this.timeToMinutes(current.timeSlot.endTime);
            const requiredTravelTime = teacher.travelTime[nextRoom.id] || 0;
            
            if (timeBetween < requiredTravelTime) {
              violations++;
            }
          }
        }
      }
    }

    return violations;
  }

  private evaluateScheduleCompactness(schedule: Schedule): number {
    let compactnessScore = 0;

    for (const classItem of this.classes) {
      const classEntries = schedule.entries
        .filter(e => e.classId === classItem.id)
        .sort((a, b) => {
          if (a.timeSlot.day !== b.timeSlot.day) {
            return a.timeSlot.day - b.timeSlot.day;
          }
          return this.timeToMinutes(a.timeSlot.startTime) - this.timeToMinutes(b.timeSlot.startTime);
        });

      // Group by day
      const dayGroups = new Map<number, ScheduleEntry[]>();
      for (const entry of classEntries) {
        if (!dayGroups.has(entry.timeSlot.day)) {
          dayGroups.set(entry.timeSlot.day, []);
        }
        dayGroups.get(entry.timeSlot.day)!.push(entry);
      }

      // Evaluate compactness for each day
      for (const [day, entries] of dayGroups) {
        if (entries.length <= 1) continue;

        const gaps = this.countGapsInDay(entries);
        compactnessScore += Math.max(0, 1 - gaps * 0.2); // Penalize gaps
      }
    }

    return compactnessScore / this.classes.length;
  }

  private countGapsInDay(entries: ScheduleEntry[]): number {
    if (entries.length <= 1) return 0;

    let gaps = 0;
    for (let i = 0; i < entries.length - 1; i++) {
      const current = entries[i];
      const next = entries[i + 1];
      
      const currentEnd = this.timeToMinutes(current.timeSlot.endTime);
      const nextStart = this.timeToMinutes(next.timeSlot.startTime);
      
      if (nextStart - currentEnd > 60) { // Gap longer than 1 hour
        gaps++;
      }
    }

    return gaps;
  }

  calculateMetrics(schedule: Schedule): ScheduleMetrics {
    const conflicts = this.detectConflicts(schedule);
    const hardViolations = conflicts.filter(c => c.severity === 'high').length;
    const softViolations = conflicts.filter(c => c.severity !== 'high').length;

    return {
      totalConflicts: conflicts.length,
      hardConstraintViolations: hardViolations,
      softConstraintViolations: softViolations,
      teacherSatisfaction: this.evaluateTeacherPreferences(schedule),
      roomUtilization: this.evaluateRoomUtilization(schedule),
      travelOptimization: 1 - (this.evaluateTravelViolations(schedule) / 100),
      overallScore: this.evaluateFitness(schedule)
    };
  }
}