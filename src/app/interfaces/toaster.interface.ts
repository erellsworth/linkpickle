import { Position, Severity } from "./misc.types";

export interface PickleToast {
    id?: number;
    title?: string;
    message: string;
    severity?: Severity;
    sticky?: boolean;
    duration?: number;
    position?: Position;
}