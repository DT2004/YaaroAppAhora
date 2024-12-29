type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: { [key: string]: EventCallback[] };

  constructor() {
    this.events = {};
  }

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
  }
}

export const eventEmitter = new EventEmitter();
