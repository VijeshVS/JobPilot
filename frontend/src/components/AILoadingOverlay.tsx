import { 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  Users,
  Brain,
  ListTodo,
  Wrench,
  BookOpen,
  Cpu,
  Database,
  X,
  ChevronRight
} from 'lucide-react';
import { ActiveEvent, SSEEventType } from '@/types/sseEvents';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AILoadingOverlayProps {
  events: ActiveEvent[];
  isConnected: boolean;
  onCancel?: () => void;
}

// Hierarchy levels: crew > task > agent > (memory, knowledge, llm, tool)
const getHierarchyLevel = (type: SSEEventType): number => {
  switch (type) {
    case 'crew':
      return 0;
    case 'task':
      return 1;
    case 'agent':
      return 2;
    case 'memory':
    case 'knowledge':
    case 'llm':
    case 'tool':
      return 3;
    default:
      return 3;
  }
};

const getEventIcon = (type: SSEEventType) => {
  switch (type) {
    case 'crew':
      return Users;
    case 'agent':
      return Brain;
    case 'task':
      return ListTodo;
    case 'tool':
      return Wrench;
    case 'knowledge':
      return BookOpen;
    case 'llm':
      return Cpu;
    case 'memory':
      return Database;
    default:
      return Sparkles;
  }
};

const getEventColor = (type: SSEEventType) => {
  switch (type) {
    case 'crew':
      return { bg: 'bg-primary', text: 'text-primary', border: 'border-primary/30', light: 'bg-primary/10' };
    case 'task':
      return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/30', light: 'bg-amber-500/10' };
    case 'agent':
      return { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500/30', light: 'bg-violet-500/10' };
    case 'memory':
      return { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/30', light: 'bg-blue-500/10' };
    case 'knowledge':
      return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/30', light: 'bg-emerald-500/10' };
    case 'llm':
      return { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500/30', light: 'bg-pink-500/10' };
    case 'tool':
      return { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500/30', light: 'bg-orange-500/10' };
    default:
      return { bg: 'bg-muted-foreground', text: 'text-muted-foreground', border: 'border-muted/30', light: 'bg-muted/10' };
  }
};

const getEventLabel = (type: SSEEventType): string => {
  switch (type) {
    case 'crew':
      return 'Crew';
    case 'agent':
      return 'Agent';
    case 'task':
      return 'Task';
    case 'tool':
      return 'Tool';
    case 'knowledge':
      return 'Knowledge';
    case 'llm':
      return 'LLM';
    case 'memory':
      return 'Memory';
    default:
      return 'Process';
  }
};

export function AILoadingOverlay({ events, isConnected, onCancel }: AILoadingOverlayProps) {
  // Group events by hierarchy
  const crewEvents = events.filter(e => e.type === 'crew');
  const taskEvents = events.filter(e => e.type === 'task');
  const agentEvents = events.filter(e => e.type === 'agent');
  const memoryEvents = events.filter(e => e.type === 'memory');
  const knowledgeEvents = events.filter(e => e.type === 'knowledge');
  const operationEvents = events.filter(e => ['llm', 'tool'].includes(e.type));

  const mainGroups = [
    { label: 'Crew', events: crewEvents, level: 0 },
    { label: 'Task', events: taskEvents, level: 1 },
    { label: 'Agent', events: agentEvents, level: 2 },
  ].filter(g => g.events.length > 0);

  const EventChip = ({ event }: { event: ActiveEvent }) => {
    const Icon = getEventIcon(event.type);
    const colors = getEventColor(event.type);
    
    return (
      <div
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300",
          event.isComplete 
            ? "bg-card border-border/50" 
            : cn(colors.light, colors.border, "shadow-sm")
        )}
      >
        <div className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
          event.isComplete ? "bg-emerald-500/10" : colors.light
        )}>
          {event.isComplete ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Icon className={cn("w-3.5 h-3.5", colors.text)} />
          )}
        </div>
        
        <span className={cn(
          "text-xs font-medium truncate",
          event.isComplete ? "text-muted-foreground" : "text-foreground"
        )}>
          {event.name}
        </span>
        
        {!event.isComplete && (
          <Loader2 className={cn("w-3 h-3 animate-spin shrink-0", colors.text)} />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-center gap-3 mb-8 mt-2">
        <div className="relative w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Agents Processing</h3>
          <p className="text-xs text-muted-foreground">
            {isConnected ? 'Orchestrating workflow...' : 'Connecting...'}
          </p>
        </div>
      </div>

      {/* Main Workflow Container */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
        {events.length === 0 && isConnected ? (
          <div className="flex items-center justify-center gap-3 py-6">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Initializing agents...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Hierarchy: Crew > Task > Agent */}
            {mainGroups.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {mainGroups.map((group, groupIndex) => (
                  <div key={group.label} className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                        {group.label}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {group.events.map((event) => (
                          <EventChip key={event.id} event={event} />
                        ))}
                      </div>
                    </div>
                    {groupIndex < mainGroups.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Separator if we have secondary groups */}
            {(memoryEvents.length > 0 || knowledgeEvents.length > 0 || operationEvents.length > 0) && mainGroups.length > 0 && (
              <div className="border-t border-border/30" />
            )}

            {/* Secondary Row: Memory & Knowledge (vertical) + Operations (remaining space) */}
            <div className="flex gap-4">
              {/* Left: Memory & Knowledge stacked vertically */}
              <div className="flex flex-col gap-3 min-w-[140px]">
                {/* Memory */}
                <div className="space-y-1.5 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      Memory
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {memoryEvents.length > 0 ? (
                      memoryEvents.map((event) => (
                        <EventChip key={event.id} event={event} />
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground/50 italic px-1">—</div>
                    )}
                  </div>
                </div>

                {/* Knowledge */}
                <div className="space-y-1.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Knowledge
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {knowledgeEvents.length > 0 ? (
                      knowledgeEvents.map((event) => (
                        <EventChip key={event.id} event={event} />
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground/50 italic px-1">—</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Operations taking remaining space */}
              <div className="flex-1 space-y-1.5 p-2 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    Operations
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {operationEvents.length > 0 ? (
                    operationEvents.map((event) => (
                      <EventChip key={event.id} event={event} />
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground/50 italic px-1">—</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">
              {events.filter(e => !e.isComplete).length} active
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-muted-foreground">
              {events.filter(e => e.isComplete).length} completed
            </span>
          </div>
        </div>
        
        {onCancel && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
