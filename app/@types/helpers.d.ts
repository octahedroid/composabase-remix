type Prettyfy<T> = {
  [K in keyof T]: T[K];
} & {};
