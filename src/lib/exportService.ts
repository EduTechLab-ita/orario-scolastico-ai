import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Schedule, Teacher, Class, Subject, Room, ExportOptions } from '../types/scheduling';
import { getDayName, formatTime } from './utils';

export class ExportService {
  static async exportToPDF(
    schedule: Schedule,
    teachers: Teacher[],
    classes: Class[],
    subjects: Subject[],
    rooms: Room[],
    options: ExportOptions
  ): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Orario Scolastico', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 50;

    if (options.groupBy === 'class') {
      for (const classItem of classes) {
        yPosition = this.addClassScheduleToPDF(pdf, schedule, classItem, teachers, subjects, rooms, yPosition, pageHeight);
      }
    } else if (options.groupBy === 'teacher') {
      for (const teacher of teachers) {
        yPosition = this.addTeacherScheduleToPDF(pdf, schedule, teacher, classes, subjects, rooms, yPosition, pageHeight);
      }
    }

    pdf.save(`orario-${schedule.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  static async exportToExcel(
    schedule: Schedule,
    teachers: Teacher[],
    classes: Class[],
    subjects: Subject[],
    rooms: Room[],
    options: ExportOptions
  ): Promise<void> {
    const workbook = XLSX.utils.book_new();

    // Main schedule sheet
    const scheduleData = this.prepareScheduleData(schedule, teachers, classes, subjects, rooms);
    const scheduleSheet = XLSX.utils.json_to_sheet(scheduleData);
    XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'Orario Generale');

    // Class schedules
    if (options.includeTeachers) {
      for (const classItem of classes) {
        const classData = this.prepareClassScheduleData(schedule, classItem, teachers, subjects, rooms);
        const classSheet = XLSX.utils.json_to_sheet(classData);
        XLSX.utils.book_append_sheet(workbook, classSheet, `Classe ${classItem.name}`);
      }
    }

    // Teacher schedules
    if (options.includeTeachers) {
      for (const teacher of teachers) {
        const teacherData = this.prepareTeacherScheduleData(schedule, teacher, classes, subjects, rooms);
        const teacherSheet = XLSX.utils.json_to_sheet(teacherData);
        XLSX.utils.book_append_sheet(workbook, teacherSheet, `${teacher.lastName} ${teacher.firstName}`);
      }
    }

    // Room utilization
    if (options.includeRooms) {
      const roomData = this.prepareRoomUtilizationData(schedule, rooms, classes, subjects);
      const roomSheet = XLSX.utils.json_to_sheet(roomData);
      XLSX.utils.book_append_sheet(workbook, roomSheet, 'Utilizzo Aule');
    }

    // Conflicts
    if (options.includeConflicts && schedule.conflicts.length > 0) {
      const conflictData = schedule.conflicts.map(conflict => ({
        Tipo: conflict.type,
        Gravità: conflict.severity,
        Descrizione: conflict.description,
        'Lezioni Coinvolte': conflict.affectedEntries.join(', ')
      }));
      const conflictSheet = XLSX.utils.json_to_sheet(conflictData);
      XLSX.utils.book_append_sheet(workbook, conflictSheet, 'Conflitti');
    }

    XLSX.writeFile(workbook, `orario-${schedule.name.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
  }

  private static addClassScheduleToPDF(
    pdf: jsPDF,
    schedule: Schedule,
    classItem: Class,
    teachers: Teacher[],
    subjects: Subject[],
    rooms: Room[],
    yPosition: number,
    pageHeight: number
  ): number {
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.text(`Classe ${classItem.name} - Sezione ${classItem.section}`, 20, yPosition);
    yPosition += 20;

    const classEntries = schedule.entries.filter(e => e.classId === classItem.id);
    
    // Create weekly grid
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    pdf.setFontSize(10);
    
    // Headers
    let xPosition = 20;
    pdf.text('Ora', xPosition, yPosition);
    xPosition += 25;
    
    for (const day of days) {
      pdf.text(day, xPosition, yPosition);
      xPosition += 25;
    }
    
    yPosition += 10;

    // Schedule grid
    for (const hour of hours) {
      xPosition = 20;
      pdf.text(hour, xPosition, yPosition);
      xPosition += 25;

      for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
        const entry = classEntries.find(e => 
          e.timeSlot.day === dayIndex && e.timeSlot.startTime === hour
        );

        if (entry) {
          const subject = subjects.find(s => s.id === entry.subjectId);
          const teacher = teachers.find(t => t.id === entry.teacherId);
          const room = rooms.find(r => r.id === entry.roomId);
          
          const text = `${subject?.code || ''}\n${teacher?.lastName || ''}\n${room?.name || ''}`;
          pdf.text(text, xPosition, yPosition);
        }

        xPosition += 25;
      }
      
      yPosition += 15;
    }

    return yPosition + 20;
  }

  private static addTeacherScheduleToPDF(
    pdf: jsPDF,
    schedule: Schedule,
    teacher: Teacher,
    classes: Class[],
    subjects: Subject[],
    rooms: Room[],
    yPosition: number,
    pageHeight: number
  ): number {
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.text(`${teacher.firstName} ${teacher.lastName}`, 20, yPosition);
    yPosition += 20;

    const teacherEntries = schedule.entries.filter(e => e.teacherId === teacher.id);
    
    // Similar grid implementation for teacher view
    // ... (implementation details)

    return yPosition + 20;
  }

  private static prepareScheduleData(
    schedule: Schedule,
    teachers: Teacher[],
    classes: Class[],
    subjects: Subject[],
    rooms: Room[]
  ) {
    return schedule.entries.map(entry => {
      const teacher = teachers.find(t => t.id === entry.teacherId);
      const classItem = classes.find(c => c.id === entry.classId);
      const subject = subjects.find(s => s.id === entry.subjectId);
      const room = rooms.find(r => r.id === entry.roomId);

      return {
        Giorno: getDayName(entry.timeSlot.day),
        'Ora Inizio': formatTime(entry.timeSlot.startTime),
        'Ora Fine': formatTime(entry.timeSlot.endTime),
        Classe: classItem?.name || '',
        Sezione: classItem?.section || '',
        Materia: subject?.name || '',
        Docente: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        Aula: room?.name || '',
        Tipo: entry.type
      };
    });
  }

  private static prepareClassScheduleData(
    schedule: Schedule,
    classItem: Class,
    teachers: Teacher[],
    subjects: Subject[],
    rooms: Room[]
  ) {
    const classEntries = schedule.entries.filter(e => e.classId === classItem.id);
    
    return classEntries.map(entry => {
      const teacher = teachers.find(t => t.id === entry.teacherId);
      const subject = subjects.find(s => s.id === entry.subjectId);
      const room = rooms.find(r => r.id === entry.roomId);

      return {
        Giorno: getDayName(entry.timeSlot.day),
        'Ora Inizio': formatTime(entry.timeSlot.startTime),
        'Ora Fine': formatTime(entry.timeSlot.endTime),
        Materia: subject?.name || '',
        Docente: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
        Aula: room?.name || ''
      };
    });
  }

  private static prepareTeacherScheduleData(
    schedule: Schedule,
    teacher: Teacher,
    classes: Class[],
    subjects: Subject[],
    rooms: Room[]
  ) {
    const teacherEntries = schedule.entries.filter(e => e.teacherId === teacher.id);
    
    return teacherEntries.map(entry => {
      const classItem = classes.find(c => c.id === entry.classId);
      const subject = subjects.find(s => s.id === entry.subjectId);
      const room = rooms.find(r => r.id === entry.roomId);

      return {
        Giorno: getDayName(entry.timeSlot.day),
        'Ora Inizio': formatTime(entry.timeSlot.startTime),
        'Ora Fine': formatTime(entry.timeSlot.endTime),
        Classe: classItem?.name || '',
        Sezione: classItem?.section || '',
        Materia: subject?.name || '',
        Aula: room?.name || ''
      };
    });
  }

  private static prepareRoomUtilizationData(
    schedule: Schedule,
    rooms: Room[],
    classes: Class[],
    subjects: Subject[]
  ) {
    return rooms.map(room => {
      const roomEntries = schedule.entries.filter(e => e.roomId === room.id);
      const utilizationHours = roomEntries.length;
      const totalAvailableHours = 48; // 8 hours * 6 days
      const utilizationPercentage = (utilizationHours / totalAvailableHours) * 100;

      return {
        Aula: room.name,
        Tipo: room.type,
        Capienza: room.capacity,
        'Ore Utilizzate': utilizationHours,
        'Ore Disponibili': totalAvailableHours,
        'Utilizzo %': utilizationPercentage.toFixed(1)
      };
    });
  }
}