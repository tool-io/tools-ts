import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sample: number;
  readonly blank: number;
  readonly blankIsSubtracted: boolean;
};
export type Output = {
  readonly corrected: number;
  readonly correction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sample: { type: "number" },
    blank: { type: "number" },
    blankIsSubtracted: { type: "boolean" },
  },
  required: ["sample", "blank", "blankIsSubtracted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, correction: { type: "number" } },
  required: ["corrected", "correction"],
} as const;
/** Calculate blank correction sign term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sample, blank, blankIsSubtracted } = request;
  const compute = (): Output => {
    return {
      corrected: sample + (blankIsSubtracted ? -blank : blank),
      correction: blankIsSubtracted ? -blank : blank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sample: 10, blank: 2, blankIsSubtracted: true },
  output: { corrected: 8, correction: -2 },
} satisfies ToolExample<Input, Output>;
export const blankCorrectionSignTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/blank-correction-sign-term",
    title: "Blank Correction Sign Term Tool",
    description:
      "Calculate blank correction sign term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sample: { type: "number" },
        blank: { type: "number" },
        blankIsSubtracted: { type: "boolean" },
      },
      required: ["sample", "blank", "blankIsSubtracted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        correction: { type: "number" },
      },
      required: ["corrected", "correction"],
    },
    ports: {
      inputs: [
        {
          id: "sample",
          label: "Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankIsSubtracted",
          label: "Blank Is Subtracted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        {
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blankCorrectionSignTermTool.execute;
export default blankCorrectionSignTermTool;
