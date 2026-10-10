import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walkingMinutes: number;
  readonly totalCycleMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkingMinutes: { type: "number", minimum: 0 },
    totalCycleMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["walkingMinutes", "totalCycleMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied walking time fraction and nonwalking remainder in one explicit positive standard-work cycle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walkingMinutes, totalCycleMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalCycleMinutes) && totalCycleMinutes > 0,
      "totalCycleMinutes",
    ),
      totalCycleMinutes);
    H.domain(
      walkingMinutes >= 0 && walkingMinutes <= totalCycleMinutes,
      "walkingMinutes",
    );
    return {
      fraction: walkingMinutes / totalCycleMinutes,
      remainder: totalCycleMinutes - walkingMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { walkingMinutes: 30, totalCycleMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const operatorStandardWorkWalkingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/operator-standard-work-walking-share",
    title: "Operator Standard Work Walking Share Tool",
    description:
      "Calculate supplied walking time fraction and nonwalking remainder in one explicit positive standard-work cycle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walkingMinutes: { type: "number", minimum: 0 },
        totalCycleMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["walkingMinutes", "totalCycleMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "walkingMinutes",
          label: "Walking Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalCycleMinutes",
          label: "Total Cycle Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = operatorStandardWorkWalkingShareTool.execute;
export default operatorStandardWorkWalkingShareTool;
