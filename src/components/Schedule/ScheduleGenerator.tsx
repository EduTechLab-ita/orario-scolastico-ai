import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Zap, Settings, Play, Square, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { Teacher, Class, Subject, Room, Schedule, OptimizationSettings } from '../../types/scheduling';
import { AIScheduleOptimizer } from '../../lib/schedulingAlgorithm';
import { generateId } from '../../lib/utils';

interface ScheduleGeneratorProps {
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  rooms: Room[];
  onScheduleGenerated: (schedule: Schedule) => void;
}

export function ScheduleGenerator({ 
  teachers, 
  classes, 
  subjects, 
  rooms, 
  onScheduleGenerated 
}: ScheduleGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [settings, setSettings] = useState<OptimizationSettings>({
    maxGenerations: 100,
    populationSize: 50,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    elitismRate: 0.2,
    convergenceThreshold: 950,
    maxRuntime: 30
  });

  const canGenerate = teachers.length > 0 && classes.length > 0 && subjects.length > 0 && rooms.length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setProgress(0);
    setGenerationLog(['Inizializzazione algoritmo AI...']);

    try {
      const optimizer = new AIScheduleOptimizer(teachers, classes, subjects, rooms, settings);
      
      const schedule = await optimizer.generateOptimalSchedule((progressValue) => {
        setProgress(progressValue);
        
        if (progressValue === 25) {
          setGenerationLog(prev => [...prev, 'Generazione popolazione iniziale...']);
        } else if (progressValue === 50) {
          setGenerationLog(prev => [...prev, 'Ottimizzazione in corso...']);
        } else if (progressValue === 75) {
          setGenerationLog(prev => [...prev, 'Risoluzione conflitti...']);
        } else if (progressValue === 100) {
          setGenerationLog(prev => [...prev, 'Orario generato con successo!']);
        }
      });

      schedule.name = `Orario ${new Date().toLocaleDateString('it-IT')}`;
      onScheduleGenerated(schedule);
      
      setGenerationLog(prev => [...prev, `Generato orario con ${schedule.entries.length} lezioni`]);
      setGenerationLog(prev => [...prev, `Conflitti rilevati: ${schedule.conflicts.length}`]);
      
    } catch (error) {
      setGenerationLog(prev => [...prev, `Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    setIsGenerating(false);
    setGenerationLog(prev => [...prev, 'Generazione interrotta dall\'utente']);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Generatore Orario AI</h2>
        <p className="text-gray-600">Utilizza algoritmi genetici per ottimizzare automaticamente l'orario scolastico</p>
      </div>

      {/* Prerequisites Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Verifica Prerequisiti
          </CardTitle>
          <CardDescription>
            Controlla che tutti i dati necessari siano configurati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              {teachers.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {teachers.length} Docenti
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {classes.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {classes.length} Classi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {subjects.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {subjects.length} Materie
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {rooms.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {rooms.length} Aule
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Impostazioni Ottimizzazione
          </CardTitle>
          <CardDescription>
            Configura i parametri dell'algoritmo genetico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxGenerations">Generazioni Max</Label>
              <Input
                id="maxGenerations"
                type="number"
                min="10"
                max="500"
                value={settings.maxGenerations}
                onChange={(e) => setSettings(prev => ({ ...prev, maxGenerations: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="populationSize">Dimensione Popolazione</Label>
              <Input
                id="populationSize"
                type="number"
                min="10"
                max="200"
                value={settings.populationSize}
                onChange={(e) => setSettings(prev => ({ ...prev, populationSize: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="maxRuntime">Tempo Max (secondi)</Label>
              <Input
                id="maxRuntime"
                type="number"
                min="5"
                max="300"
                value={settings.maxRuntime}
                onChange={(e) => setSettings(prev => ({ ...prev, maxRuntime: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="mutationRate">Tasso Mutazione</Label>
              <Input
                id="mutationRate"
                type="number"
                min="0.01"
                max="0.5"
                step="0.01"
                value={settings.mutationRate}
                onChange={(e) => setSettings(prev => ({ ...prev, mutationRate: parseFloat(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="crossoverRate">Tasso Crossover</Label>
              <Input
                id="crossoverRate"
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={settings.crossoverRate}
                onChange={(e) => setSettings(prev => ({ ...prev, crossoverRate: parseFloat(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="convergenceThreshold">Soglia Convergenza</Label>
              <Input
                id="convergenceThreshold"
                type="number"
                min="500"
                max="1000"
                value={settings.convergenceThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, convergenceThreshold: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Controllo Generazione
          </CardTitle>
          <CardDescription>
            Avvia il processo di ottimizzazione automatica dell'orario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso Ottimizzazione</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="optimization-progress h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex space-x-3">
              {!isGenerating ? (
                <Button 
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Genera Orario Ottimale
                </Button>
              ) : (
                <Button 
                  onClick={handleStop}
                  variant="destructive"
                  className="flex-1"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Interrompi Generazione
                </Button>
              )}
            </div>

            {/* Generation Log */}
            {generationLog.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Log Generazione</h4>
                <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                  {generationLog.map((log, index) => (
                    <div key={index} className="text-sm text-gray-600 py-1">
                      <span className="text-gray-400 mr-2">
                        {new Date().toLocaleTimeString('it-IT')}
                      </span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites Warning */}
            {!canGenerate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Dati Incompleti
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Per generare l'orario sono necessari almeno: 1 docente, 1 classe, 1 materia e 1 aula.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}