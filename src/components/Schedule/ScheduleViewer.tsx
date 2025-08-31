import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Download, Eye, AlertTriangle, Users, MapPin, BookOpen } from 'lucide-react';
import { Schedule, Teacher, Class, Subject, Room, ScheduleEntry } from '../../types/scheduling';
import { getDayName, formatTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ScheduleViewerProps {
  schedules: Schedule[];
  activeSchedule: Schedule | null;
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  rooms: Room[];
  onScheduleSelect: (schedule: Schedule) => void;
  onExport: () => void;
}

export function ScheduleViewer({ 
  schedules, 
  activeSchedule, 
  teachers, 
  classes, 
  subjects, 
  rooms,
  onScheduleSelect,
  onExport
}: ScheduleViewerProps) {
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedEntity, setSelectedEntity] = useState<string>('');

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  const getEntitiesForViewMode = () => {
    switch (viewMode) {
      case 'class':
        return classes.map(c => ({ id: c.id, name: `${c.name} - ${c.section}` }));
      case 'teacher':
        return teachers.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` }));
      case 'room':
        return rooms.map(r => ({ id: r.id, name: r.name }));
      default:
        return [];
    }
  };

  const getScheduleEntries = (): ScheduleEntry[] => {
    if (!activeSchedule || !selectedEntity) return [];

    return activeSchedule.entries.filter(entry => {
      switch (viewMode) {
        case 'class':
          return entry.classId === selectedEntity;
        case 'teacher':
          return entry.teacherId === selectedEntity;
        case 'room':
          return entry.roomId === selectedEntity;
        default:
          return false;
      }
    });
  };

  const getEntryForSlot = (day: number, time: string): ScheduleEntry | null => {
    const entries = getScheduleEntries();
    return entries.find(entry => 
      entry.timeSlot.day === day && entry.timeSlot.startTime === time
    ) || null;
  };

  const getEntryDisplayInfo = (entry: ScheduleEntry) => {
    const teacher = teachers.find(t => t.id === entry.teacherId);
    const classItem = classes.find(c => c.id === entry.classId);
    const subject = subjects.find(s => s.id === entry.subjectId);
    const room = rooms.find(r => r.id === entry.roomId);

    switch (viewMode) {
      case 'class':
        return {
          primary: subject?.code || 'N/A',
          secondary: teacher ? `${teacher.lastName}` : 'N/A',
          tertiary: room?.name || 'N/A'
        };
      case 'teacher':
        return {
          primary: subject?.code || 'N/A',
          secondary: classItem ? `${classItem.name}${classItem.section}` : 'N/A',
          tertiary: room?.name || 'N/A'
        };
      case 'room':
        return {
          primary: subject?.code || 'N/A',
          secondary: classItem ? `${classItem.name}${classItem.section}` : 'N/A',
          tertiary: teacher ? `${teacher.lastName}` : 'N/A'
        };
      default:
        return { primary: '', secondary: '', tertiary: '' };
    }
  };

  const entities = getEntitiesForViewMode();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visualizzazione Orario</h2>
          <p className="text-gray-600">Consulta e analizza gli orari generati</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onExport} disabled={!activeSchedule}>
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Schedule Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Selezione Orario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Orario Attivo</Label>
              <Select
                value={activeSchedule?.id || ''}
                onValueChange={(value) => {
                  const schedule = schedules.find(s => s.id === value);
                  if (schedule) onScheduleSelect(schedule);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map(schedule => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name} ({schedule.entries.length} lezioni)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Modalità Visualizzazione</Label>
              <Select value={viewMode} onValueChange={(value: 'class' | 'teacher' | 'room') => {
                setViewMode(value);
                setSelectedEntity('');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Per Classe</SelectItem>
                  <SelectItem value="teacher">Per Docente</SelectItem>
                  <SelectItem value="room">Per Aula</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                {viewMode === 'class' ? 'Classe' : viewMode === 'teacher' ? 'Docente' : 'Aula'}
              </Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder={`Seleziona ${viewMode === 'class' ? 'classe' : viewMode === 'teacher' ? 'docente' : 'aula'}`} />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {activeSchedule && selectedEntity ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Orario - {entities.find(e => e.id === selectedEntity)?.name}
            </CardTitle>
            {activeSchedule.conflicts.length > 0 && (
              <CardDescription className="flex items-center text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {activeSchedule.conflicts.length} conflitti rilevati
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="schedule-grid min-w-[800px]">
                {/* Header Row */}
                <div className="schedule-cell schedule-header">Ora</div>
                {days.map(day => (
                  <div key={day} className="schedule-cell schedule-header">
                    {day}
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map(time => (
                  <React.Fragment key={time}>
                    <div className="schedule-cell schedule-time">
                      {formatTime(time)}
                    </div>
                    {days.map((day, dayIndex) => {
                      const entry = getEntryForSlot(dayIndex, time);
                      const hasConflict = entry && activeSchedule.conflicts.some(c => 
                        c.affectedEntries.includes(entry.id)
                      );

                      if (entry) {
                        const displayInfo = getEntryDisplayInfo(entry);
                        return (
                          <div 
                            key={`${day}-${time}`}
                            className={cn(
                              "schedule-cell text-xs",
                              hasConflict && "conflict-indicator"
                            )}
                          >
                            <div className="text-center">
                              <div className="font-semibold">{displayInfo.primary}</div>
                              <div className="text-gray-600">{displayInfo.secondary}</div>
                              <div className="text-gray-500">{displayInfo.tertiary}</div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={`${day}-${time}`}
                          className="schedule-cell bg-gray-50"
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary/20 rounded mr-2"></div>
                <span>Lezione Regolare</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span>Conflitto</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
                <span>Ora Libera</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Seleziona un orario da visualizzare
            </h3>
            <p className="text-gray-500 text-center">
              Scegli un orario generato e un'entità per visualizzare la griglia oraria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Schedule Statistics */}
      {activeSchedule && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiche Orario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {activeSchedule.entries.length}
                </div>
                <div className="text-sm text-gray-600">Lezioni Totali</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {activeSchedule.fitnessScore ? Math.round(activeSchedule.fitnessScore) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Punteggio Qualità</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  activeSchedule.conflicts.length === 0 ? "text-green-600" : "text-red-600"
                )}>
                  {activeSchedule.conflicts.length}
                </div>
                <div className="text-sm text-gray-600">Conflitti</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(activeSchedule.entries.map(e => e.teacherId)).size}
                </div>
                <div className="text-sm text-gray-600">Docenti Coinvolti</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}</biltAction>