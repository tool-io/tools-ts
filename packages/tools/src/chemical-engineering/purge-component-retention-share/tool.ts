import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentInRecycle: number;
  readonly purgeFraction: number;
  readonly suppliedRetainedShare: number;
};
export type Output = {
  readonly purgedComponent: number;
  readonly retainedComponent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentInRecycle: { type: "number", minimum: 0 },
    purgeFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedRetainedShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["componentInRecycle", "purgeFraction", "suppliedRetainedShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purgedComponent: { type: "number" },
    retainedComponent: { type: "number" },
  },
  required: ["purgedComponent", "retainedComponent"],
} as const;
/** Apply explicitly supplied component purge/retention shares without a chemical process model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentInRecycle, purgeFraction, suppliedRetainedShare } = request;
  const compute = (): Output => {
    H.domain(componentInRecycle >= 0);
    H.probability(purgeFraction);
    H.probability(suppliedRetainedShare);
    return {
      purgedComponent: componentInRecycle * purgeFraction,
      retainedComponent:
        componentInRecycle * (1 - purgeFraction) * suppliedRetainedShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentInRecycle: 100,
    purgeFraction: 0.2,
    suppliedRetainedShare: 0.5,
  },
  output: { purgedComponent: 20, retainedComponent: 40 },
} satisfies ToolExample<Input, Output>;
export const purgeComponentRetentionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/purge-component-retention-share",
    title: "Purge Component Retention Share Tool",
    description:
      "Apply explicitly supplied component purge/retention shares without a chemical process model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentInRecycle: { type: "number", minimum: 0 },
        purgeFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedRetainedShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "componentInRecycle",
        "purgeFraction",
        "suppliedRetainedShare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purgedComponent: { type: "number" },
        retainedComponent: { type: "number" },
      },
      required: ["purgedComponent", "retainedComponent"],
    },
    ports: {
      inputs: [
        {
          id: "componentInRecycle",
          label: "Component In Recycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purgeFraction",
          label: "Purge Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetainedShare",
          label: "Supplied Retained Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "purgedComponent",
          label: "Purged Component",
          valueType: { type: "number" },
        },
        {
          id: "retainedComponent",
          label: "Retained Component",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purgeComponentRetentionShareTool.execute;
export default purgeComponentRetentionShareTool;
