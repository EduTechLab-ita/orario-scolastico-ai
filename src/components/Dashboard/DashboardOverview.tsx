import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, GraduationCap, BookOpen, MapPin, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Teacher, Class, Subject, Room, Schedule } from '../../types/scheduling';
import { cn } from '../../lib/utils';

interface DashboardOverviewProps {
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  rooms: Room[];
  schedules: Schedule[];
  activeSchedule: Schedule | null;
}

export function DashboardOverview({ 
  teachers, 
  classes, 
  subjects, 
  rooms, 
  schedules, 
  activeSchedule 
}: DashboardOverviewProps) {
  const totalConflicts = activeSchedule?.conflicts.length || 0;
  const highSeverityConflicts = activeSchedule?.conflicts.filter(c => c.severity === 'high').length || 0;
  
  const stats = [
    {
      title: 'Docenti',
      value: teachers.length,
      icon: Users,
      description: 'Docenti registrati nel sistema',
      color: 'text-blue-600'
    },
    {
      title: 'Classi',
      value: classes.length,
      icon: GraduationCap,
      description: 'Classi attive nell\'istituto',
      color: 'text-green-600'
    },
    {
      title: 'Materie',
      value: subjects.length,
      icon: BookOpen,
      description: 'Discipline curricolari',
      color: 'text-purple-600'
    },
    {
      title: 'Aule',
      value: rooms.length,
      icon: MapPin,
      description: 'Spazi didattici disponibili',
      color: 'text-orange-600'
    }
  ];

  const scheduleStats = [
    {
      title: 'Orari Generati',
      value: schedules.length,
      icon: Calendar,
      description: 'Versioni di orario create',
      color: 'text-indigo-600'
    },
    {
      title: 'Conflitti Totali',
      value: totalConflicts,
      icon: AlertTriangle,
      description: 'Sovrapposizioni rilevate',
      color: totalConflicts > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Conflitti Critici',
      value: highSeverityConflicts,
      icon: AlertTriangle,
      description: 'Conflitti ad alta priorità',
      color: highSeverityConflicts > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Stato Sistema',
      value: activeSchedule ? 'Attivo' : 'Inattivo',
      icon: activeSchedule ? CheckCircle : Clock,
      description: 'Stato dell\'orario corrente',
      color: activeSchedule ? 'text-green-600' : 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Benvenuto nel Sistema OrarioAI
        </h2>
        <p className="text-primary-foreground/90">
          Gestione intelligente degli orari scolastici con ottimizzazione automatica tramite algoritmi AI
        </p>
      </div>

      {/* Main Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Panoramica Generale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Schedule Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stato Orario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scheduleStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Azioni Rapide</CardTitle>
          <CardDescription>
            Operazioni frequenti per la gestione dell'orario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Aggiungi Docente</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Nuova Classe</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-medium">Genera Orario</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Attività Recenti</CardTitle>
          <CardDescription>
            Ultime modifiche al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Sistema inizializzato con dati di esempio</span>
              <span className="text-gray-400 ml-auto">Ora</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Caricati {teachers.length} docenti</span>
              <span className="text-gray-400 ml-auto">Ora</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Configurate {classes.length} classi</span>
              <span className="text-gray-400 ml-auto">Ora</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}