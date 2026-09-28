import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstQuantum: number;
  readonly secondQuantum: number;
};
export type Output = { readonly gap: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstQuantum: { type: "number", exclusiveMinimum: 0 },
    secondQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstQuantum", "secondQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, ratio: { type: "number" } },
  required: ["gap", "ratio"],
} as const;
/** Compare supplied measurement quanta without inferring accuracy or clinical interchangeability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstQuantum, secondQuantum } = request;
  const compute = (): Output => {
    H.positive(firstQuantum);
    H.positive(secondQuantum);
    return {
      gap: firstQuantum - secondQuantum,
      ratio: firstQuantum / secondQuantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstQuantum: 0.5, secondQuantum: 0.25 },
  output: { gap: 0.25, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const measurementSourceResolutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/measurement-source-resolution-gap",
    title: "Measurement Source Resolution Gap Tool",
    description:
      "Compare supplied measurement quanta without inferring accuracy or clinical interchangeability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstQuantum: { type: "number", exclusiveMinimum: 0 },
        secondQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstQuantum", "secondQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, ratio: { type: "number" } },
      required: ["gap", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstQuantum",
          label: "First Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondQuantum",
          label: "Second Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = measurementSourceResolutionGapTool.execute;
export default measurementSourceResolutionGapTool;
