import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inFirst: boolean; readonly inSecond: boolean };
export type Output = { readonly region: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inFirst: { type: "boolean" }, inSecond: { type: "boolean" } },
  required: ["inFirst", "inSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { region: { type: "string", maxLength: 8192 } },
  required: ["region"],
} as const;
/** Classify one element into the four Boolean membership regions of two sets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inFirst, inSecond } = request;
  const compute = (): Output => {
    return {
      region: inFirst
        ? inSecond
          ? "intersection"
          : "first-only"
        : inSecond
          ? "second-only"
          : "neither",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inFirst: true, inSecond: false },
  output: { region: "first-only" },
} satisfies ToolExample<Input, Output>;
export const setMembershipFourWayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-membership-four-way-label",
    title: "Set Membership Four Way Label Tool",
    description:
      "Classify one element into the four Boolean membership regions of two sets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inFirst: { type: "boolean" },
        inSecond: { type: "boolean" },
      },
      required: ["inFirst", "inSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { region: { type: "string", maxLength: 8192 } },
      required: ["region"],
    },
    ports: {
      inputs: [
        {
          id: "inFirst",
          label: "In First",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inSecond",
          label: "In Second",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "region", label: "Region", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = setMembershipFourWayLabelTool.execute;
export default setMembershipFourWayLabelTool;
