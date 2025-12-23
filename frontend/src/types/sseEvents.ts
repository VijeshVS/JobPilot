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
  agent_goal?: string;
  task_name?: string;
  task_desc?: string;
  tool_name?: string;
  tool_output?: string;
  model?: string;
  response?: string;
}

export interface ActiveEvent {
  id: string;
  type: SSEEventType;
  name: string;
  startTime: number;
  isComplete: boolean;
  details?: string;
}
