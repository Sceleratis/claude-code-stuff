/**
 * Type declarations for Bun's native SQLite module
 * Matches Bun's bun:sqlite API as of Bun v1.x
 */
declare module 'bun:sqlite' {
  // Type alias for allowed parameter shapes in SQL queries
  type SQLQueryBindings = 
    | Record<string, any>
    | any[]
    | null
    | undefined;

  // Return type for database operations that modify data
  interface Changes {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  // Prepared statement with generic return and parameter types
  interface Statement<ReturnType = any, ParamsType extends SQLQueryBindings = SQLQueryBindings> {
    run(...params: ParamsType extends any[] ? ParamsType : [ParamsType]): Changes;
    get(...params: ParamsType extends any[] ? ParamsType : [ParamsType]): ReturnType | null;
    all(...params: ParamsType extends any[] ? ParamsType : [ParamsType]): ReturnType[];
    values(...params: ParamsType extends any[] ? ParamsType : [ParamsType]): any[][];
    finalize(): void;
  }

  // Database constructor options
  interface DatabaseOptions {
    create?: boolean;
    readonly?: boolean;
    readwrite?: boolean;
    safeIntegers?: boolean;
    strict?: boolean;
  }

  // Main Database interface
  interface Database {
    // Properties
    readonly filename: string;
    readonly handle: number;
    readonly inTransaction: boolean;

    // Core query methods
    run(sql: string, ...params: any[]): Changes;
    prepare<T = any, P extends SQLQueryBindings = SQLQueryBindings>(sql: string): Statement<T, P>;
    query<T = any>(sql: string): Statement<T, any>;

    // Transaction management
    transaction<T = any>(fn: (...args: any[]) => T): (...args: any[]) => T;

    // Serialization
    serialize(attachedName?: string): Uint8Array;

    // Extensions and advanced features
    loadExtension(path: string, entryPoint?: string): void;
    fileControl(op: number, arg?: number): number;

    // Connection management
    close(): void;
  }

  // Database constructor
  interface DatabaseConstructor {
    new (
      filename?: string | ArrayBufferLike | TypedArray,
      options?: DatabaseOptions
    ): Database;

    deserialize(data: Uint8Array, options?: DatabaseOptions): Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
