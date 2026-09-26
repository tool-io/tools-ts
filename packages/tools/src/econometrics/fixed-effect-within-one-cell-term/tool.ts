import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly groupMean: number;
  readonly grandMean: number;
  readonly addGrandMean: boolean;
};
export type Output = { readonly transformed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    groupMean: { type: "number" },
    grandMean: { type: "number" },
    addGrandMean: { type: "boolean" },
  },
  required: ["value", "groupMean", "grandMean", "addGrandMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformed: { type: "number" } },
  required: ["transformed"],
} as const;
/** Caller-supplied group mean for a one-way within transform; adding the grand mean is an explicit centering convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, groupMean, grandMean, addGrandMean } = request;
  const compute = (): Output => {
    return { transformed: value - groupMean + (addGrandMean ? grandMean : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, groupMean: 8, grandMean: 5, addGrandMean: false },
  output: { transformed: 4 },
} satisfies ToolExample<Input, Output>;
export const fixedEffectWithinOneCellTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/fixed-effect-within-one-cell-term",
    title: "Fixed Effect Within One Cell Term Tool",
    description:
      "Caller-supplied group mean for a one-way within transform; adding the grand mean is an explicit centering convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        groupMean: { type: "number" },
        grandMean: { type: "number" },
        addGrandMean: { type: "boolean" },
      },
      required: ["value", "groupMean", "grandMean", "addGrandMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformed: { type: "number" } },
      required: ["transformed"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupMean",
          label: "Group Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grandMean",
          label: "Grand Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addGrandMean",
          label: "Add Grand Mean",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixedEffectWithinOneCellTermTool.execute;
export default fixedEffectWithinOneCellTermTool;
