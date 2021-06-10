import Observable from './Observable';

/**
 * Observer
 * Observer interface of Observer Pattern
 */
export default interface Observer {
    isAvailable():boolean;
    update(observable:Observable, obj:object):void;
}
