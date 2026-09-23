import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openedDay: number;
  readonly checkedDay: number;
  readonly closedDay: number;
  readonly closedKnown: boolean;
};
export type Output = {
  readonly ageAtCheck: number;
  readonly closedAgeDefined: boolean;
  readonly ageAtClosure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openedDay: { type: "integer" },
    checkedDay: { type: "integer" },
    closedDay: { type: "integer" },
    closedKnown: { type: "boolean" },
  },
  required: ["openedDay", "checkedDay", "closedDay", "closedKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageAtCheck: { type: "integer" },
    closedAgeDefined: { type: "boolean" },
    ageAtClosure: { type: "integer" },
  },
  required: ["ageAtCheck", "closedAgeDefined", "ageAtClosure"],
} as const;
/** Inspect supplied generic inspection-action timestamps without assessing biosafety conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openedDay, checkedDay, closedDay, closedKnown } = request;
  const compute = (): Output => {
    H.domain(!closedKnown || closedDay >= openedDay);
    return {
      ageAtCheck: checkedDay - openedDay,
      closedAgeDefined: closedKnown,
      ageAtClosure: closedKnown ? closedDay - openedDay : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openedDay: 100, checkedDay: 130, closedDay: 120, closedKnown: true },
  output: { ageAtCheck: 30, closedAgeDefined: true, ageAtClosure: 20 },
} satisfies ToolExample<Input, Output>;
export const inspectionActionAgeTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "biosafety/inspection-action-age",
      title: "Inspection Action Age Tool",
      description:
        "Inspect supplied generic inspection-action timestamps without assessing biosafety conditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openedDay: { type: "integer" },
          checkedDay: { type: "integer" },
          closedDay: { type: "integer" },
          closedKnown: { type: "boolean" },
        },
        required: ["openedDay", "checkedDay", "closedDay", "closedKnown"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageAtCheck: { type: "integer" },
          closedAgeDefined: { type: "boolean" },
          ageAtClosure: { type: "integer" },
        },
        required: ["ageAtCheck", "closedAgeDefined", "ageAtClosure"],
      },
      ports: {
        inputs: [
          {
            id: "openedDay",
            label: "Opened Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "checkedDay",
            label: "Checked Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "closedDay",
            label: "Closed Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "closedKnown",
            label: "Closed Known",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "ageAtCheck",
            label: "Age At Check",
            valueType: { type: "integer" },
          },
          {
            id: "closedAgeDefined",
            label: "Closed Age Defined",
            valueType: { type: "boolean" },
          },
          {
            id: "ageAtClosure",
            label: "Age At Closure",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = inspectionActionAgeTool.execute;
export default inspectionActionAgeTool;
