import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly diameterMillimeters: number };
export type Output = { readonly circumferenceMillimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diameterMillimeters: { type: "number", minimum: 0 } },
  required: ["diameterMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { circumferenceMillimeters: { type: "number" } },
  required: ["circumferenceMillimeters"],
} as const;
/** Convert an explicitly circular grip diameter into wrap circumference without recommending an ergonomic size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameterMillimeters } = request;
  const compute = (): Output => {
    H.domain(diameterMillimeters >= 0, "diameterMillimeters");
    return { circumferenceMillimeters: Math.PI * diameterMillimeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameterMillimeters: 30 },
  output: { circumferenceMillimeters: 94.24777960769379 },
} satisfies ToolExample<Input, Output>;
export const gripDiameterWrapCircumferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/grip-diameter-wrap-circumference",
    title: "Grip Diameter Wrap Circumference Tool",
    description:
      "Convert an explicitly circular grip diameter into wrap circumference without recommending an ergonomic size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diameterMillimeters: { type: "number", minimum: 0 } },
      required: ["diameterMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { circumferenceMillimeters: { type: "number" } },
      required: ["circumferenceMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "diameterMillimeters",
          label: "Diameter Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "circumferenceMillimeters",
          label: "Circumference Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gripDiameterWrapCircumferenceTool.execute;
export default gripDiameterWrapCircumferenceTool;
