import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, TrendingUp, Clock, AlertTriangle, Users, MapPin } from 'lucide-react';
import { Schedule, Teacher, Class, Subject, Room, ScheduleMetrics } from '../../types/scheduling';
import { AIScheduleOptimizer } from '../../lib/schedulingAlgorithm';

interface AnalyticsDashboardProps {
  schedules: Schedule[];
  activeSchedule: Schedule | null;
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  rooms: Room[];
}

export function AnalyticsDashboard({ 
  schedules, 
  activeSchedule, 
  teachers, 
  classes, 
  subjects, 
  rooms 
}: AnalyticsDashboardProps) {
  
  const getScheduleMetrics = (schedule: Schedule): ScheduleMetrics => {
    if (!schedule) {
      return {
        totalConflicts: 0,
        hardConstraintViolations: 0,
        softConstraintViolations: 0,
        teacherSatisfaction: 0,
        roomUtilization: 0,
        travelOptimization: 0,
        overallScore: 0
      };
    }

    const optimizer = new AIScheduleOptimizer(teachers, classes, subjects, rooms, {
      maxGenerations: 1,
      populationSize: 1,
      mutationRate: 0,
      crossoverRate: 0,
      elitismRate: 1,
      convergenceThreshold: 1000,
      maxRuntime: 1
    });

    return optimizer.calculateMetrics(schedule);
  };

  const metrics = activeSchedule ? getScheduleMetrics(activeSchedule) : null;

  const getTeacherWorkload = () => {
    if (!activeSchedule) return [];

    const workload = teachers.map(teacher => {
      const teacherEntries = activeSchedule.entries.filter(e => e.teacherId === teacher.id);
      const hoursPerDay = new Map<number, number>();
      
      teacherEntries.forEach(entry => {
        const day = entry.timeSlot.day;
        hoursPerDay.set(day, (hoursPerDay.get(day) || 0) + 1);
      });

      const maxDailyHours = Math.max(...Array.from(hoursPerDay.values()), 0);
      const totalWeeklyHours = teacherEntries.length;
      const utilizationRate = (totalWeeklyHours / teacher.totalWeeklyHours) * 100;

      return {
        teacher,
        totalWeeklyHours,
        maxDailyHours,
        utilizationRate,
        daysWorking: hoursPerDay.size
      };
    });

    return workload.sort((a, b) => b.utilizationRate - a.utilizationRate);
  };

  const getRoomUtilization = () => {
    if (!activeSchedule) return [];

    const utilization = rooms.map(room => {
      const roomEntries = activeSchedule.entries.filter(e => e.roomId === room.id);
      const totalSlots = 6 * 8; // 6 days * 8 hours
      const usedSlots = roomEntries.length;
      const utilizationRate = (usedSlots / totalSlots) * 100;

      return {
        room,
        usedSlots,
        totalSlots,
        utilizationRate
      };
    });

    return utilization.sort((a, b) => b.utilizationRate - a.utilizationRate);
  };

  const teacherWorkload = getTeacherWorkload();
  const roomUtilization = getRoomUtilization();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Analisi dettagliata delle performance dell'orario scolastico</p>
      </div>

      {/* Overall Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Punteggio Generale</CardTitle>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.overallScore)}</div>
              <p className="text-xs text-muted-foreground">
                su 1000 punti massimi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conflitti Totali</CardTitle>
              <AlertTriangle className={`w-4 h-4 ${metrics.totalConflicts > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalConflicts}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.hardConstraintViolations} critici, {metrics.softConstraintViolations} minori
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Soddisfazione Docenti</CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.teacherSatisfaction * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                preferenze rispettate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilizzo Aule</CardTitle>
              <MapPin className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(metrics.roomUtilization * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                efficienza spazi
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Workload Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Analisi Carico Docenti
          </CardTitle>
          <CardDescription>
            Distribuzione del carico di lavoro tra i docenti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teacherWorkload.length > 0 ? (
            <div className="space-y-3">
              {teacherWorkload.map(({ teacher, totalWeeklyHours, maxDailyHours, utilizationRate, daysWorking }) => (
                <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {daysWorking} giorni lavorativi • Max {maxDailyHours}h/giorno
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {totalWeeklyHours}h
                    </div>
                    <div className={`text-sm ${
                      utilizationRate > 100 ? 'text-red-600' : 
                      utilizationRate > 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {Math.round(utilizationRate)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nessun dato disponibile. Genera un orario per visualizzare l'analisi.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Room Utilization Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Utilizzo Aule
          </CardTitle>
          <CardDescription>
            Efficienza nell'utilizzo degli spazi didattici
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roomUtilization.length > 0 ? (
            <div className="space-y-3">
              {roomUtilization.map(({ room, usedSlots, totalSlots, utilizationRate }) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium flex items-center">
                      {getRoomTypeIcon(room.type)}
                      <span className="ml-2">{room.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {room.type} • Capienza: {room.capacity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {usedSlots}/{totalSlots}
                    </div>
                    <div className={`text-sm ${
                      utilizationRate > 80 ? 'text-green-600' : 
                      utilizationRate > 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(utilizationRate)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nessun dato disponibile. Genera un orario per visualizzare l'analisi.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Schedule Comparison */}
      {schedules.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Confronto Orari
            </CardTitle>
            <CardDescription>
              Comparazione delle performance tra diversi orari generati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.slice(0, 5).map(schedule => {
                const scheduleMetrics = getScheduleMetrics(schedule);
                const isActive = activeSchedule?.id === schedule.id;
                
                return (
                  <div 
                    key={schedule.id} 
                    className={`flex items-center justify-between p-3 rounded-md ${
                      isActive ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        {isActive && <Clock className="w-4 h-4 mr-2 text-primary" />}
                        {schedule.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {schedule.entries.length} lezioni • {scheduleMetrics.totalConflicts} conflitti
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {Math.round(scheduleMetrics.overallScore)}
                      </div>
                      <div className="text-sm text-gray-600">
                        punteggio
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function getRoomTypeIcon(type: string) {
    switch (type) {
      case 'lab':
        return <Monitor className="w-4 h-4 text-blue-500" />;
      case 'gym':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  }
}