import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { TeacherManager } from './components/Teachers/TeacherManager';
import { ClassManager } from './components/Classes/ClassManager';
import { SubjectManager } from './components/Subjects/SubjectManager';
import { RoomManager } from './components/Rooms/RoomManager';
import { ScheduleGenerator } from './components/Schedule/ScheduleGenerator';
import { ScheduleViewer } from './components/Schedule/ScheduleViewer';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { useScheduleData } from './hooks/useScheduleData';
import { ExportService } from './lib/exportService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    teachers,
    classes,
    subjects,
    rooms,
    plexes,
    schedules,
    activeSchedule,
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
    setActiveSchedule
  } = useScheduleData();

  const handleExport = async () => {
    if (!activeSchedule) return;

    try {
      await ExportService.exportToPDF(
        activeSchedule,
        teachers,
        classes,
        subjects,
        rooms,
        {
          format: 'pdf',
          includeTeachers: true,
          includeRooms: true,
          includeConflicts: true,
          groupBy: 'class'
        }
      );
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleScheduleGenerated = (schedule: Schedule) => {
    addSchedule(schedule);
    setActiveSchedule(schedule);
    setActiveTab('schedule');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            schedules={schedules}
            activeSchedule={activeSchedule}
          />
        );
      case 'teachers':
        return (
          <TeacherManager
            teachers={teachers}
            subjects={subjects}
            onAddTeacher={addTeacher}
            onUpdateTeacher={updateTeacher}
            onDeleteTeacher={deleteTeacher}
          />
        );
      case 'classes':
        return (
          <ClassManager
            classes={classes}
            plexes={plexes}
            onAddClass={addClass}
            onUpdateClass={updateClass}
            onDeleteClass={deleteClass}
          />
        );
      case 'subjects':
        return (
          <SubjectManager
            subjects={subjects}
            classes={classes}
            onAddSubject={addSubject}
            onUpdateSubject={updateSubject}
            onDeleteSubject={deleteSubject}
          />
        );
      case 'rooms':
        return (
          <RoomManager
            rooms={rooms}
            onAddRoom={addRoom}
            onUpdateRoom={updateRoom}
            onDeleteRoom={deleteRoom}
          />
        );
      case 'schedule':
        return schedules.length > 0 ? (
          <ScheduleViewer
            schedules={schedules}
            activeSchedule={activeSchedule}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            onScheduleSelect={setActiveSchedule}
            onExport={handleExport}
          />
        ) : (
          <ScheduleGenerator
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            onScheduleGenerated={handleScheduleGenerated}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard
            schedules={schedules}
            activeSchedule={activeSchedule}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
          />
        );
      default:
        return (
          <DashboardOverview
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            schedules={schedules}
            activeSchedule={activeSchedule}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onExport={handleExport}
        onSettings={() => setActiveTab('settings')}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;