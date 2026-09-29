import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReading: number;
  readonly secondReading: number;
  readonly firstZero: number;
  readonly secondZero: number;
  readonly tolerance: number;
};
export type Output = {
  readonly elevationDifference: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReading: { type: "number" },
    secondReading: { type: "number" },
    firstZero: { type: "number" },
    secondZero: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: [
    "firstReading",
    "secondReading",
    "firstZero",
    "secondZero",
    "tolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elevationDifference: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["elevationDifference", "withinTolerance"],
} as const;
/** Calculate staff gauge overlap reading gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstReading, secondReading, firstZero, secondZero, tolerance } =
    request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      elevationDifference:
        firstReading + firstZero - secondReading - secondZero,
      withinTolerance:
        Math.abs(firstReading + firstZero - secondReading - secondZero) <=
        tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReading: 2,
    secondReading: 1,
    firstZero: 100,
    secondZero: 101,
    tolerance: 0.01,
  },
  output: { elevationDifference: 0, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const staffGaugeOverlapReadingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/staff-gauge-overlap-reading-gap",
    title: "Staff Gauge Overlap Reading Gap Tool",
    description:
      "Calculate staff gauge overlap reading gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstReading: { type: "number" },
        secondReading: { type: "number" },
        firstZero: { type: "number" },
        secondZero: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: [
        "firstReading",
        "secondReading",
        "firstZero",
        "secondZero",
        "tolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elevationDifference: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["elevationDifference", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstReading",
          label: "First Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReading",
          label: "Second Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstZero",
          label: "First Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondZero",
          label: "Second Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elevationDifference",
          label: "Elevation Difference",
          valueType: { type: "number" },
        },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = staffGaugeOverlapReadingGapTool.execute;
export default staffGaugeOverlapReadingGapTool;
