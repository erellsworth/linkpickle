export interface PickleToast {
    id?: number;
    title?: string;
    message: string;
    severity?: 'success' | 'warning' | 'error' | 'info';
    sticky?: boolean;
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}