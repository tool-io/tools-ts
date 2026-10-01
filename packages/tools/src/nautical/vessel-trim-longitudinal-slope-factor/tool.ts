import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardDraft: number;
  readonly aftDraft: number;
  readonly length: number;
};
export type Output = { readonly slope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardDraft: { type: "number" },
    aftDraft: { type: "number" },
    length: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["forwardDraft", "aftDraft", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" } },
  required: ["slope"],
} as const;
/** Calculate vessel trim longitudinal slope factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardDraft, aftDraft, length } = request;
  const compute = (): Output => {
    H.positive(length);
    return { slope: (aftDraft - forwardDraft) / length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forwardDraft: 6, aftDraft: 8, length: 100 },
  output: { slope: 0.02 },
} satisfies ToolExample<Input, Output>;
export const vesselTrimLongitudinalSlopeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/vessel-trim-longitudinal-slope-factor",
    title: "Vessel Trim Longitudinal Slope Factor Tool",
    description:
      "Calculate vessel trim longitudinal slope factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardDraft: { type: "number" },
        aftDraft: { type: "number" },
        length: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["forwardDraft", "aftDraft", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" } },
      required: ["slope"],
    },
    ports: {
      inputs: [
        {
          id: "forwardDraft",
          label: "Forward Draft",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aftDraft",
          label: "Aft Draft",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "slope", label: "Slope", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = vesselTrimLongitudinalSlopeFactorTool.execute;
export default vesselTrimLongitudinalSlopeFactorTool;
