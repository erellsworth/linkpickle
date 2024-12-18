export type Severity = 'success' | 'warning' | 'error' | 'info';
export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
export interface NameValuePair<T = string> {
  name: string;
  value: T;
}
