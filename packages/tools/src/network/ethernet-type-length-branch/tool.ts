import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly field: number };
export type Output = { readonly branch: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { field: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["field"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { branch: { type: "string", maxLength: 8192 } },
  required: ["branch"],
} as const;
/** Calculate ethernet type length branch from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { field } = request;
  const compute = (): Output => {
    H.integer(field, 0, 65535);
    return {
      branch:
        field <= 1500 ? "length" : field >= 1536 ? "etherType" : "reserved",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { field: 1500 },
  output: { branch: "length" },
} satisfies ToolExample<Input, Output>;
export const ethernetTypeLengthBranchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ethernet-type-length-branch",
    title: "Ethernet Type Length Branch Tool",
    description:
      "Calculate ethernet type length branch from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { field: { type: "integer", minimum: 0, maximum: 65535 } },
      required: ["field"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { branch: { type: "string", maxLength: 8192 } },
      required: ["branch"],
    },
    ports: {
      inputs: [
        {
          id: "field",
          label: "Field",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "branch", label: "Branch", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = ethernetTypeLengthBranchTool.execute;
export default ethernetTypeLengthBranchTool;
