import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly started: number;
  readonly firstPassGood: number;
  readonly reworkedGood: number;
  readonly countRework: boolean;
};
export type Output = {
  readonly good: number;
  readonly yieldShare: number;
  readonly firstPassShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    started: { type: "integer", minimum: 1 },
    firstPassGood: { type: "integer", minimum: 0 },
    reworkedGood: { type: "integer", minimum: 0 },
    countRework: { type: "boolean" },
  },
  required: ["started", "firstPassGood", "reworkedGood", "countRework"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    good: { type: "integer" },
    yieldShare: { type: "number" },
    firstPassShare: { type: "number" },
  },
  required: ["good", "yieldShare", "firstPassShare"],
} as const;
/** Calculate machine yield rework base gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { started, firstPassGood, reworkedGood, countRework } = request;
  const compute = (): Output => {
    H.integer(started, 1);
    H.integer(firstPassGood, 0, started);
    H.integer(reworkedGood, 0, started - firstPassGood);
    return {
      good: firstPassGood + (countRework ? reworkedGood : 0),
      yieldShare: (firstPassGood + (countRework ? reworkedGood : 0)) / started,
      firstPassShare: firstPassGood / started,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    started: 100,
    firstPassGood: 80,
    reworkedGood: 10,
    countRework: true,
  },
  output: { good: 90, yieldShare: 0.9, firstPassShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const machineYieldReworkBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/machine-yield-rework-base-gap",
    title: "Machine Yield Rework Base Gap Tool",
    description:
      "Calculate machine yield rework base gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        started: { type: "integer", minimum: 1 },
        firstPassGood: { type: "integer", minimum: 0 },
        reworkedGood: { type: "integer", minimum: 0 },
        countRework: { type: "boolean" },
      },
      required: ["started", "firstPassGood", "reworkedGood", "countRework"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        good: { type: "integer" },
        yieldShare: { type: "number" },
        firstPassShare: { type: "number" },
      },
      required: ["good", "yieldShare", "firstPassShare"],
    },
    ports: {
      inputs: [
        {
          id: "started",
          label: "Started",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstPassGood",
          label: "First Pass Good",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reworkedGood",
          label: "Reworked Good",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countRework",
          label: "Count Rework",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "good", label: "Good", valueType: { type: "integer" } },
        {
          id: "yieldShare",
          label: "Yield Share",
          valueType: { type: "number" },
        },
        {
          id: "firstPassShare",
          label: "First Pass Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineYieldReworkBaseGapTool.execute;
export default machineYieldReworkBaseGapTool;
