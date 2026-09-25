import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentDivisionAt: number;
  readonly childDivisionAt: number;
  readonly suppliedReferenceInterval: number;
};
export type Output = {
  readonly generationInterval: number;
  readonly intervalGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentDivisionAt: { type: "number" },
    childDivisionAt: { type: "number" },
    suppliedReferenceInterval: { type: "number", minimum: 0 },
  },
  required: [
    "parentDivisionAt",
    "childDivisionAt",
    "suppliedReferenceInterval",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generationInterval: { type: "number" },
    intervalGap: { type: "number" },
  },
  required: ["generationInterval", "intervalGap"],
} as const;
/** Calculate lineage division interval gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentDivisionAt, childDivisionAt, suppliedReferenceInterval } =
    request;
  const compute = (): Output => {
    H.domain(
      childDivisionAt >= parentDivisionAt && suppliedReferenceInterval >= 0,
    );
    return {
      generationInterval: childDivisionAt - parentDivisionAt,
      intervalGap:
        childDivisionAt - parentDivisionAt - suppliedReferenceInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentDivisionAt: 2,
    childDivisionAt: 8,
    suppliedReferenceInterval: 5,
  },
  output: { generationInterval: 6, intervalGap: 1 },
} satisfies ToolExample<Input, Output>;
export const lineageDivisionIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/lineage-division-interval-gap",
    title: "Lineage Division Interval Gap Tool",
    description:
      "Calculate lineage division interval gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentDivisionAt: { type: "number" },
        childDivisionAt: { type: "number" },
        suppliedReferenceInterval: { type: "number", minimum: 0 },
      },
      required: [
        "parentDivisionAt",
        "childDivisionAt",
        "suppliedReferenceInterval",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generationInterval: { type: "number" },
        intervalGap: { type: "number" },
      },
      required: ["generationInterval", "intervalGap"],
    },
    ports: {
      inputs: [
        {
          id: "parentDivisionAt",
          label: "Parent Division At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childDivisionAt",
          label: "Child Division At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceInterval",
          label: "Supplied Reference Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "generationInterval",
          label: "Generation Interval",
          valueType: { type: "number" },
        },
        {
          id: "intervalGap",
          label: "Interval Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lineageDivisionIntervalGapTool.execute;
export default lineageDivisionIntervalGapTool;
