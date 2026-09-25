import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly period: number;
};
export type Output = { readonly distance: number; readonly antipodal: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, antipodal: { type: "boolean" } },
  required: ["distance", "antipodal"],
} as const;
/** Calculate periodic point antipode tie from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, period } = request;
  const compute = (): Output => {
    const positiveRemainder = (x: number, n: number): number => {
      const r = x % n;
      if (r >= 0) return r;
      const v = r + n;
      return v === n ? 0 : v;
    };
    const wrappedDifference = (a: number, b: number, n: number): number => {
      const d = a - b;
      return Number.isFinite(d)
        ? positiveRemainder(d, n)
        : positiveRemainder(
            positiveRemainder(a, n) - positiveRemainder(b, n),
            n,
          );
    };
    H.positive(period);
    return (() => {
      const d = wrappedDifference(second, first, period),
        distance = Math.min(d, period - d);
      return { distance, antipodal: distance === period / 2 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0, second: 5, period: 10 },
  output: { distance: 5, antipodal: true },
} satisfies ToolExample<Input, Output>;
export const periodicPointAntipodeTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/periodic-point-antipode-tie",
    title: "Periodic Point Antipode Tie Tool",
    description:
      "Calculate periodic point antipode tie from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        antipodal: { type: "boolean" },
      },
      required: ["distance", "antipodal"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "antipodal", label: "Antipodal", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = periodicPointAntipodeTieTool.execute;
export default periodicPointAntipodeTieTool;
