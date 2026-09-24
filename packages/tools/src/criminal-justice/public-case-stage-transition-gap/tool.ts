import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stages: readonly string[];
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly unknownStages: number;
  readonly backwardTransitions: number;
  readonly skippedLevels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["stages", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unknownStages: { type: "integer" },
    backwardTransitions: { type: "integer" },
    skippedLevels: { type: "integer" },
  },
  required: ["unknownStages", "backwardTransitions", "skippedLevels"],
} as const;
/** Inspect supplied public stage sequence positions without predicting legal outcomes or case eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stages, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    return (() => {
      const p = stages.map((x) => suppliedOrder.indexOf(x));
      let backwardTransitions = 0,
        skippedLevels = 0;
      for (let i = 1; i < p.length; i++)
        if (p[i] >= 0 && p[i - 1] >= 0) {
          if (p[i] < p[i - 1]) backwardTransitions++;
          if (p[i] > p[i - 1] + 1) skippedLevels += p[i] - p[i - 1] - 1;
        }
      return {
        unknownStages: p.filter((x) => x < 0).length,
        backwardTransitions,
        skippedLevels,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stages: ["A", "C", "B"], suppliedOrder: ["A", "B", "C"] },
  output: { unknownStages: 0, backwardTransitions: 1, skippedLevels: 1 },
} satisfies ToolExample<Input, Output>;
export const publicCaseStageTransitionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/public-case-stage-transition-gap",
    title: "Public Case Stage Transition Gap Tool",
    description:
      "Inspect supplied public stage sequence positions without predicting legal outcomes or case eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["stages", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unknownStages: { type: "integer" },
        backwardTransitions: { type: "integer" },
        skippedLevels: { type: "integer" },
      },
      required: ["unknownStages", "backwardTransitions", "skippedLevels"],
    },
    ports: {
      inputs: [
        {
          id: "stages",
          label: "Stages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unknownStages",
          label: "Unknown Stages",
          valueType: { type: "integer" },
        },
        {
          id: "backwardTransitions",
          label: "Backward Transitions",
          valueType: { type: "integer" },
        },
        {
          id: "skippedLevels",
          label: "Skipped Levels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCaseStageTransitionGapTool.execute;
export default publicCaseStageTransitionGapTool;
