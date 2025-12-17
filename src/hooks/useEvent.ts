import React from "react";
import pubSub from "../utils/eventBus";

export function useEvent(eventName: string, handler: Function) {
  const handlerRef = React.useRef(handler);

  React.useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const wrapper = (...args: any[]) => {
      handlerRef.current(...args);
    };

    pubSub.subscribe(eventName, wrapper);

    return () => {
      pubSub.unSubscribe(eventName, wrapper);
    };
  }, [eventName]);
}

