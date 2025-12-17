const events: Record<string, Set<Function>> = {};

function CreateEventBus() {
  function subscribe(evtName: string, func: Function) {
    console.log(
      `%cSUB:%c Someone subcribe that events ${evtName} and function ${func}`,
      "color: #1e88e5; font-weight: bold;",
      "color: #9e9e9e;"
    );
    events[evtName] = events[evtName] || new Set();
    events[evtName].add(func);
  }

  function unSubscribe(evtName: string, func: Function) {
    console.log(
      `%cUNSUB:%c Someone just unsubscribe that events ${evtName} and function ${func}`,
      "color: #e53935; font-weight: bold;",
      "color: #9e9e9e;"
    );
    if (events[evtName]) {
      events[evtName] = new Set([...events[evtName]].filter((item: Function) => item != func))
    }
  }

  function publish(evtName: string, data: unknown) {
    console.log(
      `%cPUB:%c Making broadcast event ${evtName} and data`,
      "color: #43a047; font-weight: bold;",
      "color: #9e9e9e;",
      data
    );
    if (events[evtName]) {
      events[evtName].forEach(func => func(data))
    }
  }

  return { subscribe, unSubscribe, publish }

}


const pubSub = CreateEventBus()
export default pubSub

