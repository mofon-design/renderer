export type WithRange<T extends Node> = T & { range?: [start: number, end: number] };

export type Node = WithRange<import('@babel/types').Node>;
