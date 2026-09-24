import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVisitDate: string;
  readonly revisitDate: string;
  readonly targetIntervalDays: number;
  readonly allowedToleranceDays: number;
};
export type Output = {
  readonly elapsedDays: number;
  readonly intervalGap: number;
  readonly insideSuppliedTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVisitDate: { type: "string", maxLength: 8192 },
    revisitDate: { type: "string", maxLength: 8192 },
    targetIntervalDays: { type: "integer", minimum: 0 },
    allowedToleranceDays: { type: "integer", minimum: 0 },
  },
  required: [
    "firstVisitDate",
    "revisitDate",
    "targetIntervalDays",
    "allowedToleranceDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer" },
    intervalGap: { type: "integer" },
    insideSuppliedTolerance: { type: "boolean" },
  },
  required: ["elapsedDays", "intervalGap", "insideSuppliedTolerance"],
} as const;
/** Calculate restoration plot revisit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstVisitDate,
    revisitDate,
    targetIntervalDays,
    allowedToleranceDays,
  } = request;
  const compute = (): Output => {
    H.integer(targetIntervalDays, 0);
    H.integer(allowedToleranceDays, 0);
    return (() => {
      const elapsedDays =
          (H.dateOnly(revisitDate).getTime() -
            H.dateOnly(firstVisitDate).getTime()) /
          86400000,
        intervalGap = elapsedDays - targetIntervalDays;
      return {
        elapsedDays,
        intervalGap,
        insideSuppliedTolerance: Math.abs(intervalGap) <= allowedToleranceDays,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVisitDate: "2024-01-01",
    revisitDate: "2024-01-08",
    targetIntervalDays: 5,
    allowedToleranceDays: 1,
  },
  output: { elapsedDays: 7, intervalGap: 2, insideSuppliedTolerance: false },
} satisfies ToolExample<Input, Output>;
export const restorationPlotRevisitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/restoration-plot-revisit-gap",
    title: "Restoration Plot Revisit Gap Tool",
    description:
      "Calculate restoration plot revisit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVisitDate: { type: "string", maxLength: 8192 },
        revisitDate: { type: "string", maxLength: 8192 },
        targetIntervalDays: { type: "integer", minimum: 0 },
        allowedToleranceDays: { type: "integer", minimum: 0 },
      },
      required: [
        "firstVisitDate",
        "revisitDate",
        "targetIntervalDays",
        "allowedToleranceDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer" },
        intervalGap: { type: "integer" },
        insideSuppliedTolerance: { type: "boolean" },
      },
      required: ["elapsedDays", "intervalGap", "insideSuppliedTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstVisitDate",
          label: "First Visit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "revisitDate",
          label: "Revisit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetIntervalDays",
          label: "Target Interval Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedToleranceDays",
          label: "Allowed Tolerance Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          valueType: { type: "integer" },
        },
        {
          id: "intervalGap",
          label: "Interval Gap",
          valueType: { type: "integer" },
        },
        {
          id: "insideSuppliedTolerance",
          label: "Inside Supplied Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationPlotRevisitGapTool.execute;
export default restorationPlotRevisitGapTool;
