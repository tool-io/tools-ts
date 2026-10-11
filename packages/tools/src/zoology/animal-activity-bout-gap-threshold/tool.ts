import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousBoutEnd: number;
  readonly nextBoutStart: number;
  readonly suppliedGapThreshold: number;
};
export type Output = {
  readonly observedGap: number;
  readonly distinctUnderSuppliedRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousBoutEnd: { type: "number" },
    nextBoutStart: { type: "number" },
    suppliedGapThreshold: { type: "number", minimum: 0 },
  },
  required: ["previousBoutEnd", "nextBoutStart", "suppliedGapThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGap: { type: "number" },
    distinctUnderSuppliedRule: { type: "boolean" },
  },
  required: ["observedGap", "distinctUnderSuppliedRule"],
} as const;
/** Compare an explicit animal-activity interbout gap with a supplied inclusive separation threshold without detecting bouts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousBoutEnd, nextBoutStart, suppliedGapThreshold } = request;
  const compute = (): Output => {
    H.domain(suppliedGapThreshold >= 0, "suppliedGapThreshold");
    return {
      observedGap: nextBoutStart - previousBoutEnd,
      distinctUnderSuppliedRule:
        nextBoutStart - previousBoutEnd >= suppliedGapThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousBoutEnd: 10, nextBoutStart: 20, suppliedGapThreshold: 7 },
  output: { observedGap: 10, distinctUnderSuppliedRule: true },
} satisfies ToolExample<Input, Output>;
export const animalActivityBoutGapThresholdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-activity-bout-gap-threshold",
    title: "Animal Activity Bout Gap Threshold Tool",
    description:
      "Compare an explicit animal-activity interbout gap with a supplied inclusive separation threshold without detecting bouts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousBoutEnd: { type: "number" },
        nextBoutStart: { type: "number" },
        suppliedGapThreshold: { type: "number", minimum: 0 },
      },
      required: ["previousBoutEnd", "nextBoutStart", "suppliedGapThreshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGap: { type: "number" },
        distinctUnderSuppliedRule: { type: "boolean" },
      },
      required: ["observedGap", "distinctUnderSuppliedRule"],
    },
    ports: {
      inputs: [
        {
          id: "previousBoutEnd",
          label: "Previous Bout End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextBoutStart",
          label: "Next Bout Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGapThreshold",
          label: "Supplied Gap Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedGap",
          label: "Observed Gap",
          valueType: { type: "number" },
        },
        {
          id: "distinctUnderSuppliedRule",
          label: "Distinct Under Supplied Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalActivityBoutGapThresholdTool.execute;
export default animalActivityBoutGapThresholdTool;
