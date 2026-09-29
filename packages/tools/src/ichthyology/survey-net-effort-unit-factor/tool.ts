import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netCount: number;
  readonly activeHours: number;
  readonly suppliedHoursPerEffortUnit: number;
  readonly unavailableNetHours: number;
};
export type Output = {
  readonly netHours: number;
  readonly convertedEffort: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCount: { type: "integer", minimum: 0 },
    activeHours: { type: "number", minimum: 0 },
    suppliedHoursPerEffortUnit: { type: "number", exclusiveMinimum: 0 },
    unavailableNetHours: { type: "number", minimum: 0 },
  },
  required: [
    "netCount",
    "activeHours",
    "suppliedHoursPerEffortUnit",
    "unavailableNetHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netHours: { type: "number" },
    convertedEffort: { type: "number" },
  },
  required: ["netHours", "convertedEffort"],
} as const;
/** Calculate survey net effort unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    netCount,
    activeHours,
    suppliedHoursPerEffortUnit,
    unavailableNetHours,
  } = request;
  const compute = (): Output => {
    H.integer(netCount, 0);
    H.positive(suppliedHoursPerEffortUnit);
    H.domain(
      activeHours >= 0 &&
        unavailableNetHours >= 0 &&
        unavailableNetHours <= netCount * activeHours,
    );
    return {
      netHours: netCount * activeHours - unavailableNetHours,
      convertedEffort:
        (netCount * activeHours - unavailableNetHours) /
        suppliedHoursPerEffortUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    netCount: 4,
    activeHours: 12,
    suppliedHoursPerEffortUnit: 24,
    unavailableNetHours: 0,
  },
  output: { netHours: 48, convertedEffort: 2 },
} satisfies ToolExample<Input, Output>;
export const surveyNetEffortUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/survey-net-effort-unit-factor",
    title: "Survey Net Effort Unit Factor Tool",
    description:
      "Calculate survey net effort unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCount: { type: "integer", minimum: 0 },
        activeHours: { type: "number", minimum: 0 },
        suppliedHoursPerEffortUnit: { type: "number", exclusiveMinimum: 0 },
        unavailableNetHours: { type: "number", minimum: 0 },
      },
      required: [
        "netCount",
        "activeHours",
        "suppliedHoursPerEffortUnit",
        "unavailableNetHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netHours: { type: "number" },
        convertedEffort: { type: "number" },
      },
      required: ["netHours", "convertedEffort"],
    },
    ports: {
      inputs: [
        {
          id: "netCount",
          label: "Net Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "activeHours",
          label: "Active Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHoursPerEffortUnit",
          label: "Supplied Hours Per Effort Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailableNetHours",
          label: "Unavailable Net Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netHours", label: "Net Hours", valueType: { type: "number" } },
        {
          id: "convertedEffort",
          label: "Converted Effort",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyNetEffortUnitFactorTool.execute;
export default surveyNetEffortUnitFactorTool;
