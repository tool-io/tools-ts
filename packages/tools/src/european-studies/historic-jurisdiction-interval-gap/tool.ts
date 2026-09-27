import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstEnd: number; readonly secondStart: number };
export type Output = { readonly gap: number; readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstEnd: { type: "number" }, secondStart: { type: "number" } },
  required: ["firstEnd", "secondStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
  required: ["gap", "overlap"],
} as const;
/** Compare supplied public jurisdiction endpoints on one coordinate axis; no boundary history is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEnd, secondStart } = request;
  const compute = (): Output => {
    return { gap: secondStart - firstEnd, overlap: secondStart < firstEnd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstEnd: 1800, secondStart: 1810 },
  output: { gap: 10, overlap: false },
} satisfies ToolExample<Input, Output>;
export const historicJurisdictionIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/historic-jurisdiction-interval-gap",
    title: "Historic Jurisdiction Interval Gap Tool",
    description:
      "Compare supplied public jurisdiction endpoints on one coordinate axis; no boundary history is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
      },
      required: ["firstEnd", "secondStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = historicJurisdictionIntervalGapTool.execute;
export default historicJurisdictionIntervalGapTool;
