import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly oldFirst: string;
  readonly second: string;
  readonly newFirst: string;
};
export type Output = { readonly distance: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "integer", minimum: 0 },
    oldFirst: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
    newFirst: { type: "string", maxLength: 8192 },
  },
  required: ["distance", "oldFirst", "second", "newFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "integer" }, delta: { type: "integer" } },
  required: ["distance", "delta"],
} as const;
/** Calculate hamming distance single symbol update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, oldFirst, second, newFirst } = request;
  const compute = (): Output => {
    H.integer(distance, 0);
    const delta = (newFirst === second ? 0 : 1) - (oldFirst === second ? 0 : 1);
    H.domain(distance + delta >= 0);
    return { distance: distance + delta, delta };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 3, oldFirst: "a", second: "a", newFirst: "b" },
  output: { distance: 4, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const hammingDistanceSingleSymbolUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/hamming-distance-single-symbol-update",
    title: "Hamming Distance Single Symbol Update Tool",
    description:
      "Calculate hamming distance single symbol update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "integer", minimum: 0 },
        oldFirst: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
        newFirst: { type: "string", maxLength: 8192 },
      },
      required: ["distance", "oldFirst", "second", "newFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "integer" }, delta: { type: "integer" } },
      required: ["distance", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldFirst",
          label: "Old First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "newFirst",
          label: "New First",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "integer" } },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = hammingDistanceSingleSymbolUpdateTool.execute;
export default hammingDistanceSingleSymbolUpdateTool;
