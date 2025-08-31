import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, MapPin, Users, Monitor } from 'lucide-react';
import { Room } from '../../types/scheduling';
import { DataValidator } from '../../lib/dataValidation';

interface RoomManagerProps {
  rooms: Room[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onUpdateRoom: (id: string, updates: Partial<Room>) => void;
  onDeleteRoom: (id: string) => void;
}

export function RoomManager({ 
  rooms, 
  onAddRoom, 
  onUpdateRoom, 
  onDeleteRoom 
}: RoomManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    type: 'classroom',
    capacity: 30,
    equipment: [],
    availability: []
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState('');

  const handleSubmit = () => {
    const validationErrors = DataValidator.validateRoom(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingRoom) {
      onUpdateRoom(editingRoom.id, formData);
    } else {
      onAddRoom(formData as Omit<Room, 'id'>);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'classroom',
      capacity: 30,
      equipment: [],
      availability: []
    });
    setEditingRoom(null);
    setIsDialogOpen(false);
    setErrors([]);
    setNewEquipment('');
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsDialogOpen(true);
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter((_, i) => i !== index) || []
    }));
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'gym':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'library':
        return <MapPin className="w-5 h-5 text-purple-500" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoomTypeName = (type: string) => {
    switch (type) {
      case 'classroom':
        return 'Aula Standard';
      case 'lab':
        return 'Laboratorio';
      case 'gym':
        return 'Palestra';
      case 'library':
        return 'Biblioteca';
      case 'special':
        return 'Aula Speciale';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestione Aule</h2>
          <p className="text-gray-600">Configura gli spazi didattici e le loro caratteristiche</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRoom(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? 'Modifica Aula' : 'Nuova Aula'}
              </DialogTitle>
              <DialogDescription>
                Configura l'aula e le sue caratteristiche tecniche
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
                  <Label htmlFor="name">Nome Aula</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Aula 1A"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo Aula</Label>
                  <Select
                    value={formData.type || 'classroom'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Room['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Aula Standard</SelectItem>
                      <SelectItem value="lab">Laboratorio</SelectItem>
                      <SelectItem value="gym">Palestra</SelectItem>
                      <SelectItem value="library">Biblioteca</SelectItem>
                      <SelectItem value="special">Aula Speciale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="capacity">Capienza</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                />
              </div>

              {/* Equipment */}
              <div className="space-y-3">
                <Label>Attrezzature</Label>
                
                <div className="flex space-x-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Aggiungi attrezzatura"
                    onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                  />
                  <Button type="button" onClick={addEquipment} size="sm">
                    Aggiungi
                  </Button>
                </div>

                {formData.equipment && formData.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md flex items-center"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeEquipment(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Annulla
              </Button>
              <Button onClick={handleSubmit}>
                {editingRoom ? 'Aggiorna' : 'Aggiungi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms List */}
      <div className="grid gap-4">
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessuna aula configurata
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Aggiungi le aule disponibili nel tuo istituto
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Prima Aula
              </Button>
            </CardContent>
          </Card>
        ) : (
          rooms.map(room => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {getRoomTypeIcon(room.type)}
                      <span className="ml-2">{room.name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {room.capacity} posti
                      </span>
                      <span className="text-sm">
                        {getRoomTypeName(room.type)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(room)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {room.equipment.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attrezzature</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}