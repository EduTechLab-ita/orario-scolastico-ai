import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, BookOpen, Clock, Beaker } from 'lucide-react';
import { Subject, Class } from '../../types/scheduling';
import { DataValidator } from '../../lib/dataValidation';

interface SubjectManagerProps {
  subjects: Subject[];
  classes: Class[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
}

export function SubjectManager({ 
  subjects, 
  classes, 
  onAddSubject, 
  onUpdateSubject, 
  onDeleteSubject 
}: SubjectManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    code: '',
    weeklyHours: {},
    requiresSpecialRoom: false,
    specialRoomType: undefined,
    canBeSplit: true,
    requiresContinuity: false
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors = DataValidator.validateSubject(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingSubject) {
      onUpdateSubject(editingSubject.id, formData);
    } else {
      onAddSubject(formData as Omit<Subject, 'id'>);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      weeklyHours: {},
      requiresSpecialRoom: false,
      specialRoomType: undefined,
      canBeSplit: true,
      requiresContinuity: false
    });
    setEditingSubject(null);
    setIsDialogOpen(false);
    setErrors([]);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData(subject);
    setIsDialogOpen(true);
  };

  const updateWeeklyHours = (classId: string, hours: number) => {
    setFormData(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [classId]: hours
      }
    }));
  };

  const getTotalWeeklyHours = (subject: Subject): number => {
    return Object.values(subject.weeklyHours).reduce((sum, hours) => sum + hours, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestione Materie</h2>
          <p className="text-gray-600">Configura le discipline curricolari e il monte ore</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSubject(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Materia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Modifica Materia' : 'Nuova Materia'}
              </DialogTitle>
              <DialogDescription>
                Configura la materia e assegna le ore settimanali per ogni classe
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
                  <Label htmlFor="name">Nome Materia</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Matematica"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Codice</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="MAT"
                  />
                </div>
              </div>

              {/* Special Room Requirements */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium text-gray-900">Requisiti Aula</h4>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresSpecialRoom"
                    checked={formData.requiresSpecialRoom || false}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      requiresSpecialRoom: e.target.checked,
                      specialRoomType: e.target.checked ? 'lab' : undefined
                    }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="requiresSpecialRoom">Richiede aula speciale</Label>
                </div>

                {formData.requiresSpecialRoom && (
                  <div>
                    <Label htmlFor="specialRoomType">Tipo Aula Speciale</Label>
                    <Select
                      value={formData.specialRoomType || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, specialRoomType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo aula" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab">Laboratorio</SelectItem>
                        <SelectItem value="gym">Palestra</SelectItem>
                        <SelectItem value="library">Biblioteca</SelectItem>
                        <SelectItem value="special">Aula Speciale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canBeSplit"
                      checked={formData.canBeSplit || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, canBeSplit: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="canBeSplit">Può essere suddivisa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requiresContinuity"
                      checked={formData.requiresContinuity || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, requiresContinuity: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="requiresContinuity">Richiede continuità</Label>
                  </div>
                </div>
              </div>

              {/* Weekly Hours Assignment */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium text-gray-900">Monte Ore Settimanale</h4>
                <div className="grid gap-3">
                  {classes.map(classItem => (
                    <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-medium">Classe {classItem.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({classItem.studentsCount} studenti)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.weeklyHours?.[classItem.id] || 0}
                          onChange={(e) => updateWeeklyHours(classItem.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="text-sm text-gray-500">ore/sett</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Annulla
              </Button>
              <Button onClick={handleSubmit}>
                {editingSubject ? 'Aggiorna' : 'Aggiungi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subjects List */}
      <div className="grid gap-4">
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessuna materia configurata
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Aggiungi le materie curricolari per definire il piano di studi
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Prima Materia
              </Button>
            </CardContent>
          </Card>
        ) : (
          subjects.map(subject => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {subject.requiresSpecialRoom && (
                        <Beaker className="w-5 h-5 mr-2 text-orange-500" />
                      )}
                      {subject.name}
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {subject.code}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getTotalWeeklyHours(subject)} ore totali/settimana
                      </span>
                      {subject.requiresSpecialRoom && (
                        <span className="text-orange-600 text-sm">
                          Richiede {subject.specialRoomType}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(subject)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteSubject(subject.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Distribuzione Ore per Classe</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(subject.weeklyHours).map(([classId, hours]) => {
                      const classItem = classes.find(c => c.id === classId);
                      return (
                        <div key={classId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">
                            {classItem?.name || classId}
                          </span>
                          <span className="text-sm text-gray-600">
                            {hours}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {subject.canBeSplit && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Suddivisibile
                      </span>
                    )}
                    {subject.requiresContinuity && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Richiede continuità
                      </span>
                    )}
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