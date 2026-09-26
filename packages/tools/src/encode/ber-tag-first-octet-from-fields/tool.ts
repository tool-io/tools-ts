import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly tagClass: number;
  readonly constructed: boolean;
  readonly tagNumber: number;
};
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tagClass: { type: "integer", minimum: 0, maximum: 3 },
    constructed: { type: "boolean" },
    tagNumber: { type: "integer", minimum: 0, maximum: 31 },
  },
  required: ["tagClass", "constructed", "tagNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Compute ber tag first octet from fields from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { tagClass, constructed, tagNumber } = input;
  const compute = (): Output => {
    integer(tagClass, 0, 3);
    integer(tagNumber, 0, 31);
    return { octet: tagClass * 64 + (constructed ? 32 : 0) + tagNumber };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { tagClass: 0, constructed: true, tagNumber: 16 },
  output: { octet: 48 },
} satisfies ToolExample<Input, Output>;
export const berTagFirstOctetFromFieldsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/ber-tag-first-octet-from-fields",
  title: "BER Tag First Octet From Fields Tool",
  description:
    "Compute ber tag first octet from fields from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "tagClass",
        label: "Tag Class",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "constructed",
        label: "Constructed",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "tagNumber",
        label: "Tag Number",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "octet", label: "Octet", valueType: { type: "integer" } }],
  },
});
export const run = berTagFirstOctetFromFieldsTool.execute;
export default berTagFirstOctetFromFieldsTool;
