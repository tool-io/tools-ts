import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLength: number;
  readonly repeatLength: number;
};
export type Output = {
  readonly repeats: number;
  readonly cutLength: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLength: { type: "number", minimum: 0 },
    repeatLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["requiredLength", "repeatLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repeats: { type: "integer" },
    cutLength: { type: "number" },
    excess: { type: "number" },
  },
  required: ["repeats", "cutLength", "excess"],
} as const;
/** Align a single cut length upward to whole print repeats. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLength, repeatLength } = request;
  const compute = (): Output => {
    H.domain(requiredLength >= 0);
    H.positive(repeatLength);
    return {
      repeats: Math.ceil(requiredLength / repeatLength),
      cutLength: Math.ceil(requiredLength / repeatLength) * repeatLength,
      excess:
        Math.ceil(requiredLength / repeatLength) * repeatLength -
        requiredLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredLength: 130, repeatLength: 40 },
  output: { repeats: 4, cutLength: 160, excess: 30 },
} satisfies ToolExample<Input, Output>;
export const fabricDirectionalPrintCuttingLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/fabric-directional-print-cutting-loss",
    title: "Fabric Directional Print Cutting Loss Tool",
    description: "Align a single cut length upward to whole print repeats.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLength: { type: "number", minimum: 0 },
        repeatLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["requiredLength", "repeatLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repeats: { type: "integer" },
        cutLength: { type: "number" },
        excess: { type: "number" },
      },
      required: ["repeats", "cutLength", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "requiredLength",
          label: "Required Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatLength",
          label: "Repeat Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "repeats", label: "Repeats", valueType: { type: "integer" } },
        { id: "cutLength", label: "Cut Length", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fabricDirectionalPrintCuttingLossTool.execute;
export default fabricDirectionalPrintCuttingLossTool;
