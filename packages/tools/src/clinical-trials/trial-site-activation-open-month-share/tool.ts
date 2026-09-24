import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly monthStart: number;
  readonly monthEnd: number;
  readonly activated: number;
  readonly suspendedDays: number;
};
export type Output = { readonly openDays: number; readonly monthShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    monthStart: { type: "integer" },
    monthEnd: { type: "integer" },
    activated: { type: "integer" },
    suspendedDays: { type: "integer", minimum: 0 },
  },
  required: ["monthStart", "monthEnd", "activated", "suspendedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { openDays: { type: "integer" }, monthShare: { type: "number" } },
  required: ["openDays", "monthShare"],
} as const;
/** Calculate trial site activation open month share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { monthStart, monthEnd, activated, suspendedDays } = request;
  const compute = (): Output => {
    H.domain(monthEnd > monthStart);
    H.integer(suspendedDays, 0);
    H.domain(
      suspendedDays <= Math.max(0, monthEnd - Math.max(monthStart, activated)),
    );
    return {
      openDays:
        Math.max(0, monthEnd - Math.max(monthStart, activated)) - suspendedDays,
      monthShare:
        (Math.max(0, monthEnd - Math.max(monthStart, activated)) -
          suspendedDays) /
        (monthEnd - monthStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { monthStart: 100, monthEnd: 130, activated: 110, suspendedDays: 2 },
  output: { openDays: 18, monthShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const trialSiteActivationOpenMonthShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-site-activation-open-month-share",
    title: "Trial Site Activation Open Month Share Tool",
    description:
      "Calculate trial site activation open month share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        monthStart: { type: "integer" },
        monthEnd: { type: "integer" },
        activated: { type: "integer" },
        suspendedDays: { type: "integer", minimum: 0 },
      },
      required: ["monthStart", "monthEnd", "activated", "suspendedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openDays: { type: "integer" },
        monthShare: { type: "number" },
      },
      required: ["openDays", "monthShare"],
    },
    ports: {
      inputs: [
        {
          id: "monthStart",
          label: "Month Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthEnd",
          label: "Month End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "activated",
          label: "Activated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suspendedDays",
          label: "Suspended Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "openDays", label: "Open Days", valueType: { type: "integer" } },
        {
          id: "monthShare",
          label: "Month Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialSiteActivationOpenMonthShareTool.execute;
export default trialSiteActivationOpenMonthShareTool;
