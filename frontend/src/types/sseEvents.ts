export type SSEEventType = 
  | 'crew' 
  | 'agent' 
  | 'task' 
  | 'tool' 
  | 'knowledge' 
  | 'llm' 
  | 'memory';

export type SSEEventAction = 'start' | 'complete';

export interface SSEEventPayload {
  type: SSEEventType;
  action: SSEEventAction;
  crew_name?: string;
  agent_role?: string;
  task_name?: string;
  tool_name?: string;
  model?: string;
}

export interface ActiveEvent {
  id: string;
  type: SSEEventType;
  name: string;
  startTime: number;
  isComplete: boolean;
}
