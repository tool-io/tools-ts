import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPresent: readonly boolean[];
  readonly secondPresent: readonly boolean[];
};
export type Output = {
  readonly complete: readonly boolean[];
  readonly completeCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPresent: { type: "array", maxItems: 256, items: { type: "boolean" } },
    secondPresent: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["firstPresent", "secondPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complete: { type: "array", maxItems: 256, items: { type: "boolean" } },
    completeCount: { type: "integer" },
  },
  required: ["complete", "completeCount"],
} as const;
/** Pairwise observation-completeness mask; a present value is not assumed valid or clinically complete. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPresent, secondPresent } = request;
  const compute = (): Output => {
    H.domain(firstPresent.length === secondPresent.length);
    const complete = firstPresent.map((v, i) => v && secondPresent[i]);
    return { complete, completeCount: complete.filter(Boolean).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPresent: [true, false, true],
    secondPresent: [true, true, false],
  },
  output: { complete: [true, false, false], completeCount: 1 },
} satisfies ToolExample<Input, Output>;
export const eldercareResearchCompleteCasePairMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/eldercare-research-complete-case-pair-mask",
      title: "Eldercare Research Complete Case Pair Mask Tool",
      description:
        "Pairwise observation-completeness mask; a present value is not assumed valid or clinically complete.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPresent: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          secondPresent: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["firstPresent", "secondPresent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complete: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          completeCount: { type: "integer" },
        },
        required: ["complete", "completeCount"],
      },
      ports: {
        inputs: [
          {
            id: "firstPresent",
            label: "First Present",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "secondPresent",
            label: "Second Present",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "complete",
            label: "Complete",
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "completeCount",
            label: "Complete Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = eldercareResearchCompleteCasePairMaskTool.execute;
export default eldercareResearchCompleteCasePairMaskTool;
