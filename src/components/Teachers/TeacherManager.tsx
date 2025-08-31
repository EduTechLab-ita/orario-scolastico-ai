import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Mail, Clock, MapPin, Users } from 'lucide-react';
import { Teacher, Subject } from '../../types/scheduling';
import { DataValidator } from '../../lib/dataValidation';
import { generateId } from '../../lib/utils';

interface TeacherManagerProps {
  teachers: Teacher[];
  subjects: Subject[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (id: string, updates: Partial<Teacher>) => void;
  onDeleteTeacher: (id: string) => void;
}

export function TeacherManager({ 
  teachers, 
  subjects, 
  onAddTeacher, 
  onUpdateTeacher, 
  onDeleteTeacher 
}: TeacherManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    firstName: '',
    lastName: '',
    email: '',
    subjects: [],
    availability: [],
    preferences: {
      preferredTimeSlots: [],
      avoidedTimeSlots: [],
      preferredClasses: [],
      maxConsecutiveHours: 4,
      preferredDays: [0, 1, 2, 3, 4]
    },
    travelTime: {},
    maxHoursPerDay: 6,
    totalWeeklyHours: 18
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors = DataValidator.validateTeacher(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingTeacher) {
      onUpdateTeacher(editingTeacher.id, formData);
    } else {
      onAddTeacher(formData as Omit<Teacher, 'id'>);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subjects: [],
      availability: [],
      preferences: {
        preferredTimeSlots: [],
        avoidedTimeSlots: [],
        preferredClasses: [],
        maxConsecutiveHours: 4,
        preferredDays: [0, 1, 2, 3, 4]
      },
      travelTime: {},
      maxHoursPerDay: 6,
      totalWeeklyHours: 18
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
    setErrors([]);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setIsDialogOpen(true);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...(prev.subjects || []), subjectId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestione Docenti</h2>
          <p className="text-gray-600">Configura l'anagrafe dei docenti e le loro disponibilità</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTeacher(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Docente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? 'Modifica Docente' : 'Nuovo Docente'}
              </DialogTitle>
              <DialogDescription>
                Inserisci i dati del docente e configura le sue disponibilità
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Mario"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Cognome</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Rossi"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="mario.rossi@scuola.it"
                />
              </div>

              {/* Subject Assignment */}
              <div>
                <Label>Materie Insegnate</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjects.map(subject => (
                    <label key={subject.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subjects?.includes(subject.id) || false}
                        onChange={() => handleSubjectToggle(subject.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxHoursPerDay">Ore Max Giornaliere</Label>
                  <Input
                    id="maxHoursPerDay"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.maxHoursPerDay || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxHoursPerDay: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="totalWeeklyHours">Ore Settimanali Totali</Label>
                  <Input
                    id="totalWeeklyHours"
                    type="number"
                    min="1"
                    max="40"
                    value={formData.totalWeeklyHours || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalWeeklyHours: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Annulla
              </Button>
              <Button onClick={handleSubmit}>
                {editingTeacher ? 'Aggiorna' : 'Aggiungi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers List */}
      <div className="grid gap-4">
        {teachers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun docente configurato
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Inizia aggiungendo i docenti del tuo istituto per poter generare gli orari
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Primo Docente
              </Button>
            </CardContent>
          </Card>
        ) : (
          teachers.map(teacher => (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {teacher.firstName} {teacher.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {teacher.email}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {teacher.totalWeeklyHours}h/settimana
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(teacher)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteTeacher(teacher.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Materie Insegnate</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map(subjectId => {
                        const subject = subjects.find(s => s.id === subjectId);
                        return (
                          <span
                            key={subjectId}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                          >
                            {subject?.name || subjectId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ore max giornaliere:</span>
                      <span className="ml-2 font-medium">{teacher.maxHoursPerDay}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Giorni disponibili:</span>
                      <span className="ml-2 font-medium">{teacher.availability.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}