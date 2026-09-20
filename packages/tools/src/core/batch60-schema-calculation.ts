import {
  defineTool,
  type ToolContract,
  type ToolDefinition,
  type ToolJsonSchema,
} from "./definition.js";
import { matchesToolJsonSchema } from "./contract.js";
import { isPortableJsonValue } from "./json-value.js";
import { invalidInput, toolSuccess } from "./result.js";
import { simpleError, SimpleToolError } from "./simple.js";

export function domain(
  condition: unknown,
  field = "",
  message = "Input is outside the documented domain.",
): asserts condition {
  if (!condition) simpleError(field, message, "invalid_domain");
}
export function requireInput(value: unknown, schema: ToolJsonSchema): void {
  if (!matchesToolJsonSchema(value, schema)) {
    const record =
      value !== null && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
    let bad = "";
    try {
      if (record)
        bad =
          Object.entries(schema.properties ?? {}).find(([key, rule]) => {
            const descriptor = Object.getOwnPropertyDescriptor(record, key);
            return (
              !descriptor ||
              !Object.hasOwn(descriptor, "value") ||
              !matchesToolJsonSchema(descriptor.value, rule)
            );
          })?.[0] ??
          Object.keys(record).find(
            (key) => !Object.hasOwn(schema.properties ?? {}, key),
          ) ??
          "";
    } catch {
      /* Hostile object traps are malformed input, not calculation failures. */
    }
    simpleError(
      bad,
      "Input must match the declared finite JSON contract.",
      "invalid_field",
    );
  }
}
export function requireOutput(value: unknown, schema: ToolJsonSchema): void {
  if (!matchesToolJsonSchema(value, schema))
    simpleError(
      "",
      "The result exceeds the portable numeric or size range.",
      "result_out_of_range",
    );
}
/** JSON has one zero value; canonicalize signed arithmetic zeros before export. */
export function canonicalOutput<Output>(value: Output): Output {
  const normalize = (entry: unknown): unknown => {
    if (typeof entry === "number") return Object.is(entry, -0) ? 0 : entry;
    if (Array.isArray(entry)) return entry.map(normalize);
    if (entry !== null && typeof entry === "object")
      return Object.fromEntries(
        Object.entries(entry).map(([k, v]) => [k, normalize(v)]),
      );
    return entry;
  };
  return normalize(value) as Output;
}
export function defineSchemaCalculation<Input, Output>(
  config: Omit<ToolContract, "contractVersion" | "execution"> & {
    readonly calculate: (input: Input) => Output;
  },
): ToolDefinition<Input, Output> {
  const { calculate, ...contract } = config;
  return defineTool({
    ...contract,
    contractVersion: 1,
    execution: { kind: "pure" },
    execute(input) {
      try {
        requireInput(input, contract.inputSchema);
        return toolSuccess(calculate(input as Input));
      } catch (error) {
        if (error instanceof SimpleToolError)
          return invalidInput([
            { code: error.code, field: error.field, message: error.message },
          ]);
        throw error;
      }
    },
  });
}
export const integer = (
  x: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  domain(Number.isSafeInteger(x) && x >= min && x <= max);
  return x;
};
export const positive = (x: number): number => {
  domain(Number.isFinite(x) && x > 0);
  return x;
};
export const finite = (x: number): number => {
  domain(Number.isFinite(x));
  return x;
};
export const probability = (x: number): number => {
  domain(Number.isFinite(x) && x >= 0 && x <= 1);
  return x;
};
export const sameLength = (
  a: readonly unknown[],
  b: readonly unknown[],
): void => {
  domain(a.length === b.length);
};
export const mod = (x: number, n: number): number =>
  ((x % positive(n)) + n) % n;
export const dot = (a: readonly number[], b: readonly number[]): number => {
  sameLength(a, b);
  return finite(a.reduce((s, v, i) => s + v * b[i], 0));
};
export function parseJson(s: string): unknown {
  try {
    const x: unknown = JSON.parse(s);
    domain(s.length <= 8192);
    domain(isPortableJsonValue(x));
    return x;
  } catch {
    return simpleError("", "Enter valid bounded JSON.", "invalid_json");
  }
}
export function plain(x: unknown): Record<string, unknown> {
  domain(x !== null && typeof x === "object" && !Array.isArray(x));
  return x as Record<string, unknown>;
}
export function list(x: unknown): readonly unknown[] {
  domain(Array.isArray(x) && x.length <= 256);
  return x;
}
export function text(x: unknown): string {
  domain(typeof x === "string");
  return x;
}
export function codePoint(x: number): number {
  integer(x, 0, 0x10ffff);
  domain(x < 0xd800 || x > 0xdfff);
  return x;
}
export function decimal(s: string): bigint {
  domain(/^[+-]?\d{1,128}(?![\s\S])/.test(s));
  return BigInt(s);
}
export function dateOnly(s: string): Date {
  domain(/^\d{4}-\d{2}-\d{2}$/.test(s));
  const d = new Date(s + "T00:00:00Z");
  domain(Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s);
  return d;
}
