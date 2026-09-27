import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly supportCount: number;
  readonly zeroWithinTolerance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["probabilities", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportCount: { type: "integer" },
    zeroWithinTolerance: { type: "integer" },
  },
  required: ["supportCount", "zeroWithinTolerance"],
} as const;
/** Count supplied positive strategy masses under an explicit tolerance without asserting a normalized equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, tolerance } = request;
  const compute = (): Output => {
    H.domain(probabilities.every((x) => x >= 0 && x <= 1) && tolerance >= 0);
    return {
      supportCount: probabilities.filter((x) => x > tolerance).length,
      zeroWithinTolerance: probabilities.filter((x) => x <= tolerance).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.5, 0.5, 0], tolerance: 0 },
  output: { supportCount: 2, zeroWithinTolerance: 1 },
} satisfies ToolExample<Input, Output>;
export const strategySupportPositiveCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/strategy-support-positive-count",
    title: "Strategy Support Positive Count Tool",
    description:
      "Count supplied positive strategy masses under an explicit tolerance without asserting a normalized equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["probabilities", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportCount: { type: "integer" },
        zeroWithinTolerance: { type: "integer" },
      },
      required: ["supportCount", "zeroWithinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "supportCount",
          label: "Support Count",
          valueType: { type: "integer" },
        },
        {
          id: "zeroWithinTolerance",
          label: "Zero Within Tolerance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = strategySupportPositiveCountTool.execute;
export default strategySupportPositiveCountTool;
