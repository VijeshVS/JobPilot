import { useState, useCallback, useRef } from 'react';
import { SSEEventPayload, ActiveEvent } from '@/types/sseEvents';

const getEventName = (payload: SSEEventPayload): string => {
  switch (payload.type) {
    case 'crew':
      return payload.crew_name || 'Crew';
    case 'agent':
      return payload.agent_role || 'Agent';
    case 'task':
      return payload.task_name || 'Task';
    case 'tool':
      return payload.tool_name || 'Tool';
    case 'knowledge':
      return 'Knowledge Base';
    case 'llm':
      return payload.model || 'LLM';
    case 'memory':
      return 'Memory';
    default:
      return 'Unknown';
  }
};

const getEventId = (payload: SSEEventPayload): string => {
  const name = getEventName(payload);
  return `${payload.type}-${name}`;
};

// Event map to track start events with unique IDs
const eventMap: Record<string, string> = {};

export const useSSEEvents = () => {
  const [events, setEvents] = useState<ActiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback((prompt: string) => {
    // Reset state and event map
    setEvents([]);
    setIsComplete(false);
    setIsConnected(true);
    Object.keys(eventMap).forEach(key => delete eventMap[key]);
    
    console.log("Initialized the SSE in the frontend to receive the events");

    // Create EventSource connection
    const url = new URL('http://localhost:8000/events');
    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    const onMessage = (event: MessageEvent) => {
      try {
        const payload: SSEEventPayload = JSON.parse(event.data);
        const eventName = getEventName(payload);
        const baseEventId = getEventId(payload);

        if (payload.action === 'start') {
          const eventId = baseEventId + Date.now().toString();
          eventMap[baseEventId] = eventId;

          setEvents(prev => {
            if (prev.some(e => e.id === eventId && !e.isComplete)) {
              return prev;
            }
            return [
              ...prev,
              {
                id: eventId,
                type: payload.type,
                name: eventName,
                startTime: Date.now(),
                isComplete: false
              }
            ];
          });
        }

        if (payload.action === 'complete') {
          const eventId = eventMap[baseEventId];
          if (eventId) {
            setEvents(prev =>
              prev.map(e =>
                e.id === eventId && !e.isComplete
                  ? { ...e, isComplete: true }
                  : e
              )
            );
          }
        }
      } catch (err) {
        console.error('Invalid SSE payload:', event.data, err);
      }
    };

    eventSource.onmessage = onMessage;

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      setIsConnected(false);
      setIsComplete(true);
    };

    eventSource.addEventListener('done', () => {
      eventSource.close();
      setIsConnected(false);
      setIsComplete(true);
    });

  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    events,
    isConnected,
    isComplete,
    connect,
    disconnect
  };
};
