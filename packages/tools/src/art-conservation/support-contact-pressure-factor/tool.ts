import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly force: number; readonly contactArea: number };
export type Output = { readonly pressure: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    contactArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "contactArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pressure: { type: "number" } },
  required: ["pressure"],
} as const;
/** Calculate support contact pressure factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, contactArea } = request;
  const compute = (): Output => {
    H.domain(force >= 0);
    H.positive(contactArea);
    return { pressure: force / contactArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 20, contactArea: 0.01 },
  output: { pressure: 2000 },
} satisfies ToolExample<Input, Output>;
export const supportContactPressureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/support-contact-pressure-factor",
    title: "Support Contact Pressure Factor Tool",
    description:
      "Calculate support contact pressure factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        contactArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "contactArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pressure: { type: "number" } },
      required: ["pressure"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number", unit: "N" },
        },
        {
          id: "contactArea",
          label: "Contact Area",
          required: true,
          valueType: { type: "number", unit: "m2" },
        },
      ],
      outputs: [
        {
          id: "pressure",
          label: "Pressure",
          valueType: { type: "number", unit: "Pa" },
        },
      ],
    },
  },
  calculate,
});
export const run = supportContactPressureFactorTool.execute;
export default supportContactPressureFactorTool;
