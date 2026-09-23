import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recycleStreamMass: number;
  readonly componentFraction: number;
  readonly purgeFraction: number;
};
export type Output = {
  readonly componentInStream: number;
  readonly componentPurged: number;
  readonly componentReturned: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recycleStreamMass: { type: "number", minimum: 0 },
    componentFraction: { type: "number", minimum: 0, maximum: 1 },
    purgeFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["recycleStreamMass", "componentFraction", "purgeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentInStream: { type: "number" },
    componentPurged: { type: "number" },
    componentReturned: { type: "number" },
  },
  required: ["componentInStream", "componentPurged", "componentReturned"],
} as const;
/** Split one explicitly supplied recycle-stream component through a purge, without solving a process. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recycleStreamMass, componentFraction, purgeFraction } = request;
  const compute = (): Output => {
    H.domain(recycleStreamMass >= 0);
    H.probability(componentFraction);
    H.probability(purgeFraction);
    return (() => {
      const componentInStream = recycleStreamMass * componentFraction,
        componentPurged = componentInStream * purgeFraction;
      return {
        componentInStream,
        componentPurged,
        componentReturned: componentInStream - componentPurged,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recycleStreamMass: 100, componentFraction: 0.2, purgeFraction: 0.1 },
  output: { componentInStream: 20, componentPurged: 2, componentReturned: 18 },
} satisfies ToolExample<Input, Output>;
export const recyclePurgeComponentShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/recycle-purge-component-share",
    title: "Recycle Purge Component Share Tool",
    description:
      "Split one explicitly supplied recycle-stream component through a purge, without solving a process.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recycleStreamMass: { type: "number", minimum: 0 },
        componentFraction: { type: "number", minimum: 0, maximum: 1 },
        purgeFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["recycleStreamMass", "componentFraction", "purgeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentInStream: { type: "number" },
        componentPurged: { type: "number" },
        componentReturned: { type: "number" },
      },
      required: ["componentInStream", "componentPurged", "componentReturned"],
    },
    ports: {
      inputs: [
        {
          id: "recycleStreamMass",
          label: "Recycle Stream Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentFraction",
          label: "Component Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purgeFraction",
          label: "Purge Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentInStream",
          label: "Component In Stream",
          valueType: { type: "number" },
        },
        {
          id: "componentPurged",
          label: "Component Purged",
          valueType: { type: "number" },
        },
        {
          id: "componentReturned",
          label: "Component Returned",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recyclePurgeComponentShareTool.execute;
export default recyclePurgeComponentShareTool;
