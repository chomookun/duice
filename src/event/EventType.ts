import {Event} from "./Event";

/**
 * Event type
 */
export type EventType = new (...args: any[]) => Event;
