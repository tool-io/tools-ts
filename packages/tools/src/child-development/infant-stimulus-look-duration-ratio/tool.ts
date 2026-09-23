import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstLook: number; readonly secondLook: number };
export type Output = { readonly ratio: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLook: { type: "number", minimum: 0 },
    secondLook: { type: "number", minimum: 0 },
  },
  required: ["firstLook", "secondLook"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, defined: { type: "boolean" } },
  required: ["ratio", "defined"],
} as const;
/** Compare explicit nonclinical looking durations without developmental interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLook, secondLook } = request;
  const compute = (): Output => {
    H.domain(firstLook >= 0 && secondLook >= 0);
    return {
      ratio: firstLook > 0 ? secondLook / firstLook : 0,
      defined: firstLook > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLook: 4, secondLook: 6 },
  output: { ratio: 1.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const infantStimulusLookDurationRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/infant-stimulus-look-duration-ratio",
    title: "Infant Stimulus Look Duration Ratio Tool",
    description:
      "Compare explicit nonclinical looking durations without developmental interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLook: { type: "number", minimum: 0 },
        secondLook: { type: "number", minimum: 0 },
      },
      required: ["firstLook", "secondLook"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, defined: { type: "boolean" } },
      required: ["ratio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "firstLook",
          label: "First Look",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLook",
          label: "Second Look",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = infantStimulusLookDurationRatioTool.execute;
export default infantStimulusLookDurationRatioTool;
