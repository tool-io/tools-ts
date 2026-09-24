import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly returned: number; readonly issued: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returned: { type: "integer", minimum: 0 },
    issued: { type: "integer", minimum: 0 },
  },
  required: ["returned", "issued"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Audit explicit inventory return counts without inferring adherence or product suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returned, issued } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0, issued);
    return { share: issued > 0 ? returned / issued : 0, defined: issued > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returned: 3, issued: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const medicineReturnCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/medicine-return-count-share",
    title: "Medicine Return Count Share Tool",
    description:
      "Audit explicit inventory return counts without inferring adherence or product suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returned: { type: "integer", minimum: 0 },
        issued: { type: "integer", minimum: 0 },
      },
      required: ["returned", "issued"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = medicineReturnCountShareTool.execute;
export default medicineReturnCountShareTool;
