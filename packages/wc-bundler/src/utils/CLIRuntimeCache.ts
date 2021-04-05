import { env } from './env';

export interface CLIRuntimeCacheFlush<T> {
  (this: CLIRuntimeCache<T>, filter: (ratio?: number) => boolean): void;
}

export class CLIRuntimeCache<T> {
  private _max = 0;
  private _used = 0;
  private flushing = false;
  private filter = (ratio = this.ratio): boolean => {
    return env.DISABLE_CLI_RUNTIME_CACHE ? true : Math.random() > 1 - ratio;
  };

  public value: T;
  public ratio: number;
  public flush: CLIRuntimeCacheFlush<T>;

  public get max(): number {
    return env.DISABLE_CLI_RUNTIME_CACHE ? 0 : this._max;
  }
  public set max(value: number) {
    this._max = value >= 0 ? value : 0;
    this.check();
  }

  public get used(): number {
    return this._used;
  }
  public set used(value: number) {
    this._used = Number(value) || 0;
    this.check();
  }

  constructor(value: T, flush: CLIRuntimeCacheFlush<T>, max = 1 << 20, ratio = 0.2) {
    this._max = max;
    this.value = value;
    this.ratio = ratio;
    this.flush = flush;
  }

  public use(size: number): boolean {
    size = Number(size) || 0;
    if (size >= this.max * this.ratio) return false;
    this.used += size;
    return true;
  }

  private check(): void {
    if (this.flushing) return;
    this.flushing = true;
    while (this.max < this.used) this.flush(this.filter);
    this.flushing = false;
  }
}
