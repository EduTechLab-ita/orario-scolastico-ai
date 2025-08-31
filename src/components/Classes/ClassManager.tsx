import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Users, Clock, MapPin } from 'lucide-react';
import { Class, Plex } from '../../types/scheduling';
import { DataValidator } from '../../lib/dataValidation';

interface ClassManagerProps {
  classes: Class[];
  plexes: Plex[];
  onAddClass: (classItem: Omit<Class, 'id'>) => void;
  onUpdateClass: (id: string, updates: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
}

export function ClassManager({ 
  classes, 
  plexes, 
  onAddClass, 
  onUpdateClass, 
  onDeleteClass 
}: ClassManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    section: '',
    year: 1,
    studentsCount: 25,
    plexId: '',
    schedule: {
      type: 'normal',
      afternoonSessions: false,
      maxHoursPerDay: 6
    },
    specialNeeds: []
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors = DataValidator.validateClass(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingClass) {
      onUpdateClass(editingClass.id, formData);
    } else {
      onAddClass(formData as Omit<Class, 'id'>);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      section: '',
      year: 1,
      studentsCount: 25,
      plexId: '',
      schedule: {
        type: 'normal',
        afternoonSessions: false,
        maxHoursPerDay: 6
      },
      specialNeeds: []
    });
    setEditingClass(null);
    setIsDialogOpen(false);
    setErrors([]);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData(classItem);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestione Classi</h2>
          <p className="text-gray-600">Configura le classi dell'istituto e i loro orari</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingClass(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Classe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? 'Modifica Classe' : 'Nuova Classe'}
              </DialogTitle>
              <DialogDescription>
                Inserisci i dati della classe e configura il tipo di orario
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Nome Classe</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="1A"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Sezione</Label>
                  <Input
                    id="section"
                    value={formData.section || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    placeholder="A"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Anno</Label>
                  <Select
                    value={formData.year?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona anno" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}° Anno
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentsCount">Numero Studenti</Label>
                  <Input
                    id="studentsCount"
                    type="number"
                    min="1"
                    max="35"
                    value={formData.studentsCount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentsCount: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="plexId">Plesso</Label>
                  <Select
                    value={formData.plexId || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, plexId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona plesso" />
                    </SelectTrigger>
                    <SelectContent>
                      {plexes.map(plex => (
                        <SelectItem key={plex.id} value={plex.id}>
                          {plex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Schedule Configuration */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-gray-900">Configurazione Orario</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduleType">Tipo Orario</Label>
                    <Select
                      value={formData.schedule?.type || 'normal'}
                      onValueChange={(value: 'normal' | 'extended') => 
                        setFormData(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule!, type: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Tempo Normale</SelectItem>
                        <SelectItem value="extended">Tempo Prolungato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxHoursPerDay">Ore Max Giornaliere</Label>
                    <Input
                      id="maxHoursPerDay"
                      type="number"
                      min="4"
                      max="8"
                      value={formData.schedule?.maxHoursPerDay || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        schedule: { ...prev.schedule!, maxHoursPerDay: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="afternoonSessions"
                    checked={formData.schedule?.afternoonSessions || false}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule!, afternoonSessions: e.target.checked }
                    }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="afternoonSessions">Rientri Pomeridiani</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Annulla
              </Button>
              <Button onClick={handleSubmit}>
                {editingClass ? 'Aggiorna' : 'Aggiungi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes List */}
      <div className="grid gap-4">
        {classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessuna classe configurata
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Aggiungi le classi del tuo istituto per iniziare la pianificazione degli orari
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Prima Classe
              </Button>
            </CardContent>
          </Card>
        ) : (
          classes.map(classItem => {
            const plex = plexes.find(p => p.id === classItem.plexId);
            
            return (
              <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Classe {classItem.name} - Sezione {classItem.section}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {classItem.studentsCount} studenti
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {plex?.name || 'Plesso non specificato'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {classItem.schedule.type === 'normal' ? 'Tempo Normale' : 'Tempo Prolungato'}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(classItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteClass(classItem.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Anno:</span>
                      <span className="ml-2 font-medium">{classItem.year}°</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ore max/giorno:</span>
                      <span className="ml-2 font-medium">{classItem.schedule.maxHoursPerDay}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rientri:</span>
                      <span className="ml-2 font-medium">
                        {classItem.schedule.afternoonSessions ? 'Sì' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}