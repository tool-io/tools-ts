import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTip: number;
  readonly contributingPeople: number;
};
export type Output = { readonly tipPerPerson: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTip: { type: "number", minimum: 0 },
    contributingPeople: { type: "integer", minimum: 1 },
  },
  required: ["totalTip", "contributingPeople"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tipPerPerson: { type: "number" } },
  required: ["tipPerPerson"],
} as const;
/** Divide an explicitly selected guide tip equally among a positive number of contributors, without recommending a tip amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTip, contributingPeople } = request;
  const compute = (): Output => {
    H.domain(totalTip >= 0, "totalTip");
    (H.domain(
      Number.isSafeInteger(contributingPeople) &&
        contributingPeople >= 1 &&
        contributingPeople <= Number.MAX_SAFE_INTEGER,
      "contributingPeople",
    ),
      contributingPeople);
    return { tipPerPerson: totalTip / contributingPeople };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalTip: 45, contributingPeople: 6 },
  output: { tipPerPerson: 7.5 },
} satisfies ToolExample<Input, Output>;
export const guideTipPersonShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "tourism/guide-tip-person-share",
      title: "Guide Tip Person Share Tool",
      description:
        "Divide an explicitly selected guide tip equally among a positive number of contributors, without recommending a tip amount.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalTip: { type: "number", minimum: 0 },
          contributingPeople: { type: "integer", minimum: 1 },
        },
        required: ["totalTip", "contributingPeople"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tipPerPerson: { type: "number" } },
        required: ["tipPerPerson"],
      },
      ports: {
        inputs: [
          {
            id: "totalTip",
            label: "Total Tip",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contributingPeople",
            label: "Contributing People",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "tipPerPerson",
            label: "Tip Per Person",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = guideTipPersonShareTool.execute;
export default guideTipPersonShareTool;
