import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueCorrect: number;
  readonly baseCorrect: number;
  readonly tolerance: number;
};
export type Output = { readonly gap: number; readonly uninformative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueCorrect: { type: "number", minimum: 0, maximum: 1 },
    baseCorrect: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["cueCorrect", "baseCorrect", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, uninformative: { type: "boolean" } },
  required: ["gap", "uninformative"],
} as const;
/** Calculate cue validity uninformative base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueCorrect, baseCorrect, tolerance } = request;
  const compute = (): Output => {
    H.probability(cueCorrect);
    H.probability(baseCorrect);
    H.domain(tolerance >= 0);
    return {
      gap: cueCorrect - baseCorrect,
      uninformative: Math.abs(cueCorrect - baseCorrect) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueCorrect: 0.5, baseCorrect: 0.5, tolerance: 0 },
  output: { gap: 0, uninformative: true },
} satisfies ToolExample<Input, Output>;
export const cueValidityUninformativeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/cue-validity-uninformative-base-flag",
    title: "Cue Validity Uninformative Base Flag Tool",
    description:
      "Calculate cue validity uninformative base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueCorrect: { type: "number", minimum: 0, maximum: 1 },
        baseCorrect: { type: "number", minimum: 0, maximum: 1 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["cueCorrect", "baseCorrect", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        uninformative: { type: "boolean" },
      },
      required: ["gap", "uninformative"],
    },
    ports: {
      inputs: [
        {
          id: "cueCorrect",
          label: "Cue Correct",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseCorrect",
          label: "Base Correct",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "uninformative",
          label: "Uninformative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cueValidityUninformativeBaseFlagTool.execute;
export default cueValidityUninformativeBaseFlagTool;
