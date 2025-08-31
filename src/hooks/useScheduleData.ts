import { useState, useEffect } from 'react';
import { Teacher, Class, Subject, Room, Schedule, Plex } from '../types/scheduling';
import { loadFromLocalStorage, saveToLocalStorage, generateId } from '../lib/utils';

export function useScheduleData() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [plexes, setPlexes] = useState<Plex[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setTeachers(loadFromLocalStorage('teachers', getDefaultTeachers()));
    setClasses(loadFromLocalStorage('classes', getDefaultClasses()));
    setSubjects(loadFromLocalStorage('subjects', getDefaultSubjects()));
    setRooms(loadFromLocalStorage('rooms', getDefaultRooms()));
    setPlexes(loadFromLocalStorage('plexes', getDefaultPlexes()));
    setSchedules(loadFromLocalStorage('schedules', []));
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    saveToLocalStorage('teachers', teachers);
  }, [teachers]);

  useEffect(() => {
    saveToLocalStorage('classes', classes);
  }, [classes]);

  useEffect(() => {
    saveToLocalStorage('subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    saveToLocalStorage('rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    saveToLocalStorage('plexes', plexes);
  }, [plexes]);

  useEffect(() => {
    saveToLocalStorage('schedules', schedules);
  }, [schedules]);

  // Teacher management
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: generateId() };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Class management
  const addClass = (classItem: Omit<Class, 'id'>) => {
    const newClass = { ...classItem, id: generateId() };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Subject management
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: generateId() };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Room management
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: generateId() };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // Schedule management
  const addSchedule = (schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    if (activeSchedule?.id === id) {
      setActiveSchedule(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    if (activeSchedule?.id === id) {
      setActiveSchedule(null);
    }
  };

  return {
    // Data
    teachers,
    classes,
    subjects,
    rooms,
    plexes,
    schedules,
    activeSchedule,
    
    // Actions
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addClass,
    updateClass,
    deleteClass,
    addSubject,
    updateSubject,
    deleteSubject,
    addRoom,
    updateRoom,
    deleteRoom,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    setActiveSchedule
  };
}

// Default data for demo purposes
function getDefaultTeachers(): Teacher[] {
  return [
    {
      id: 'teacher-1',
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@scuola.it',
      subjects: ['math', 'science'],
      availability: [
        { day: 0, startTime: '08:00', endTime: '13:00' },
        { day: 1, startTime: '08:00', endTime: '13:00' },
        { day: 2, startTime: '08:00', endTime: '13:00' },
        { day: 3, startTime: '08:00', endTime: '13:00' },
        { day: 4, startTime: '08:00', endTime: '13:00' }
      ],
      preferences: {
        preferredTimeSlots: [
          { day: 0, startTime: '09:00', endTime: '11:00' }
        ],
        avoidedTimeSlots: [
          { day: 4, startTime: '12:00', endTime: '13:00' }
        ],
        preferredClasses: ['class-1'],
        maxConsecutiveHours: 4,
        preferredDays: [0, 1, 2, 3, 4]
      },
      travelTime: {},
      maxHoursPerDay: 6,
      totalWeeklyHours: 18
    },
    {
      id: 'teacher-2',
      firstName: 'Anna',
      lastName: 'Bianchi',
      email: 'anna.bianchi@scuola.it',
      subjects: ['italian', 'history'],
      availability: [
        { day: 0, startTime: '08:00', endTime: '13:00' },
        { day: 1, startTime: '08:00', endTime: '13:00' },
        { day: 2, startTime: '08:00', endTime: '13:00' },
        { day: 3, startTime: '08:00', endTime: '13:00' },
        { day: 4, startTime: '08:00', endTime: '13:00' }
      ],
      preferences: {
        preferredTimeSlots: [],
        avoidedTimeSlots: [],
        preferredClasses: [],
        maxConsecutiveHours: 5,
        preferredDays: [0, 1, 2, 3, 4]
      },
      travelTime: {},
      maxHoursPerDay: 6,
      totalWeeklyHours: 20
    }
  ];
}

function getDefaultClasses(): Class[] {
  return [
    {
      id: 'class-1',
      name: '1A',
      section: 'A',
      year: 1,
      studentsCount: 25,
      plexId: 'plex-1',
      schedule: {
        type: 'normal',
        afternoonSessions: false,
        maxHoursPerDay: 6
      },
      specialNeeds: []
    },
    {
      id: 'class-2',
      name: '2B',
      section: 'B',
      year: 2,
      studentsCount: 23,
      plexId: 'plex-1',
      schedule: {
        type: 'extended',
        afternoonSessions: true,
        lunchBreak: { day: 0, startTime: '13:00', endTime: '14:00' },
        maxHoursPerDay: 8
      },
      specialNeeds: []
    }
  ];
}

function getDefaultSubjects(): Subject[] {
  return [
    {
      id: 'math',
      name: 'Matematica',
      code: 'MAT',
      weeklyHours: {
        'class-1': 6,
        'class-2': 6
      },
      requiresSpecialRoom: false,
      canBeSplit: true,
      requiresContinuity: false
    },
    {
      id: 'italian',
      name: 'Italiano',
      code: 'ITA',
      weeklyHours: {
        'class-1': 8,
        'class-2': 7
      },
      requiresSpecialRoom: false,
      canBeSplit: true,
      requiresContinuity: false
    },
    {
      id: 'science',
      name: 'Scienze',
      code: 'SCI',
      weeklyHours: {
        'class-1': 2,
        'class-2': 3
      },
      requiresSpecialRoom: true,
      specialRoomType: 'lab',
      canBeSplit: false,
      requiresContinuity: true
    },
    {
      id: 'history',
      name: 'Storia',
      code: 'STO',
      weeklyHours: {
        'class-1': 2,
        'class-2': 2
      },
      requiresSpecialRoom: false,
      canBeSplit: true,
      requiresContinuity: false
    }
  ];
}

function getDefaultRooms(): Room[] {
  return [
    {
      id: 'room-1',
      name: 'Aula 1A',
      type: 'classroom',
      capacity: 30,
      equipment: ['lavagna', 'proiettore'],
      availability: []
    },
    {
      id: 'room-2',
      name: 'Aula 2B',
      type: 'classroom',
      capacity: 28,
      equipment: ['lavagna', 'computer'],
      availability: []
    },
    {
      id: 'lab-1',
      name: 'Laboratorio Scienze',
      type: 'lab',
      capacity: 25,
      equipment: ['microscopi', 'reagenti', 'banconi'],
      availability: []
    },
    {
      id: 'gym-1',
      name: 'Palestra',
      type: 'gym',
      capacity: 35,
      equipment: ['attrezzi ginnici', 'materassini'],
      availability: []
    }
  ];
}

function getDefaultPlexes(): Plex[] {
  return [
    {
      id: 'plex-1',
      name: 'Plesso Centrale',
      address: 'Via Roma 123',
      rooms: [],
      travelTimeToOtherPlexes: {
        'plex-2': 15
      }
    },
    {
      id: 'plex-2',
      name: 'Plesso Secondario',
      address: 'Via Milano 456',
      rooms: [],
      travelTimeToOtherPlexes: {
        'plex-1': 15
      }
    }
  ];
}