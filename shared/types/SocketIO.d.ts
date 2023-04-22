import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface IEmitEvents extends DefaultEventsMap {
	example : () => void;
}

type IListenEvents = IEmitEvents;
