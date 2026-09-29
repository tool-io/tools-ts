import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnFlow: number;
  readonly totalFlow: number;
  readonly excludedFlow: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominatorFlow: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnFlow: { type: "number", minimum: 0 },
    totalFlow: { type: "number" },
    excludedFlow: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["returnFlow", "totalFlow", "excludedFlow", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorFlow: { type: "number" },
    share: { type: "number" },
  },
  required: ["denominatorFlow", "share"],
} as const;
/** Calculate return flow share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnFlow, totalFlow, excludedFlow, excludeMarked } = request;
  const compute = (): Output => {
    H.domain(
      totalFlow > excludedFlow &&
        excludedFlow >= 0 &&
        returnFlow >= 0 &&
        returnFlow <= totalFlow - excludedFlow,
    );
    return {
      denominatorFlow: totalFlow - (excludeMarked ? excludedFlow : 0),
      share: returnFlow / (totalFlow - (excludeMarked ? excludedFlow : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnFlow: 20,
    totalFlow: 100,
    excludedFlow: 20,
    excludeMarked: true,
  },
  output: { denominatorFlow: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const returnFlowShareTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "hydroponics/return-flow-share",
    title: "Return Flow Share Tool",
    description:
      "Calculate return flow share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnFlow: { type: "number", minimum: 0 },
        totalFlow: { type: "number" },
        excludedFlow: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: ["returnFlow", "totalFlow", "excludedFlow", "excludeMarked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorFlow: { type: "number" },
        share: { type: "number" },
      },
      required: ["denominatorFlow", "share"],
    },
    ports: {
      inputs: [
        {
          id: "returnFlow",
          label: "Return Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFlow",
          label: "Excluded Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorFlow",
          label: "Denominator Flow",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = returnFlowShareTool.execute;
export default returnFlowShareTool;
