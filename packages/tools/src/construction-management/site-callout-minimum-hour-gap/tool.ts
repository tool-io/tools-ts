import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualHours: number;
  readonly suppliedMinimum: number;
  readonly rate: number;
};
export type Output = {
  readonly billableHours: number;
  readonly minimumIncrement: number;
  readonly charge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualHours: { type: "number", minimum: 0 },
    suppliedMinimum: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
  },
  required: ["actualHours", "suppliedMinimum", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billableHours: { type: "number" },
    minimumIncrement: { type: "number" },
    charge: { type: "number" },
  },
  required: ["billableHours", "minimumIncrement", "charge"],
} as const;
/** Calculate site callout minimum hour gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualHours, suppliedMinimum, rate } = request;
  const compute = (): Output => {
    H.domain(actualHours >= 0 && suppliedMinimum >= 0 && rate >= 0);
    return {
      billableHours: Math.max(actualHours, suppliedMinimum),
      minimumIncrement: Math.max(0, suppliedMinimum - actualHours),
      charge: Math.max(actualHours, suppliedMinimum) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualHours: 2, suppliedMinimum: 4, rate: 50 },
  output: { billableHours: 4, minimumIncrement: 2, charge: 200 },
} satisfies ToolExample<Input, Output>;
export const siteCalloutMinimumHourGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/site-callout-minimum-hour-gap",
    title: "Site Callout Minimum Hour Gap Tool",
    description:
      "Calculate site callout minimum hour gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualHours: { type: "number", minimum: 0 },
        suppliedMinimum: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
      },
      required: ["actualHours", "suppliedMinimum", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billableHours: { type: "number" },
        minimumIncrement: { type: "number" },
        charge: { type: "number" },
      },
      required: ["billableHours", "minimumIncrement", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "actualHours",
          label: "Actual Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMinimum",
          label: "Supplied Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billableHours",
          label: "Billable Hours",
          valueType: { type: "number" },
        },
        {
          id: "minimumIncrement",
          label: "Minimum Increment",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = siteCalloutMinimumHourGapTool.execute;
export default siteCalloutMinimumHourGapTool;
