import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citingCoordinate: number;
  readonly citedCoordinate: number;
  readonly originOffset: number;
};
export type Output = { readonly age: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citingCoordinate: { type: "number" },
    citedCoordinate: { type: "number" },
    originOffset: { type: "number" },
  },
  required: ["citingCoordinate", "citedCoordinate", "originOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "number" } },
  required: ["age"],
} as const;
/** Calculate citation age origin offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citingCoordinate, citedCoordinate, originOffset } = request;
  const compute = (): Output => {
    return { age: citingCoordinate - citedCoordinate - originOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citingCoordinate: 2024, citedCoordinate: 2020, originOffset: 0 },
  output: { age: 4 },
} satisfies ToolExample<Input, Output>;
export const citationAgeOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-age-origin-offset",
    title: "Citation Age Origin Offset Tool",
    description:
      "Calculate citation age origin offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citingCoordinate: { type: "number" },
        citedCoordinate: { type: "number" },
        originOffset: { type: "number" },
      },
      required: ["citingCoordinate", "citedCoordinate", "originOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { age: { type: "number" } },
      required: ["age"],
    },
    ports: {
      inputs: [
        {
          id: "citingCoordinate",
          label: "Citing Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "citedCoordinate",
          label: "Cited Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originOffset",
          label: "Origin Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "age", label: "Age", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = citationAgeOriginOffsetTool.execute;
export default citationAgeOriginOffsetTool;
