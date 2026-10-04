import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly zone: string };
export type Output = { readonly valid: boolean; readonly canonical: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zone: { type: "string", maxLength: 8192 } },
  required: ["zone"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    canonical: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "canonical"],
} as const;
/** Compute http date imf fixdate zone token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { zone } = input;
  const compute = (): Output => {
    const valid = zone === "GMT";
    return { valid, canonical: valid ? "GMT" : "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { zone: "GMT" },
  output: { valid: true, canonical: "GMT" },
} satisfies ToolExample<Input, Output>;
export const httpDateImfFixdateZoneTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-date-imf-fixdate-zone-token",
  title: "HTTP Date IMF Fixdate Zone Token Tool",
  description:
    "Compute http date imf fixdate zone token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "zone",
        label: "Zone",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "canonical", label: "Canonical", valueType: { type: "string" } },
    ],
  },
});
export const run = httpDateImfFixdateZoneTokenTool.execute;
export default httpDateImfFixdateZoneTokenTool;
