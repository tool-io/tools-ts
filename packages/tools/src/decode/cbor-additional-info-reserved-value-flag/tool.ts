import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = {
  readonly majorType: number;
  readonly additionalInfo: number;
  readonly reserved: boolean;
  readonly indefinite: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorType: { type: "integer" },
    additionalInfo: { type: "integer" },
    reserved: { type: "boolean" },
    indefinite: { type: "boolean" },
  },
  required: ["majorType", "additionalInfo", "reserved", "indefinite"],
} as const;
/** Compute cbor additional info reserved value flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    integer(octet, 0, 255);
    const additionalInfo = octet & 31;
    return {
      majorType: octet >> 5,
      additionalInfo,
      reserved: additionalInfo >= 28 && additionalInfo <= 30,
      indefinite: additionalInfo === 31,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 159 },
  output: {
    majorType: 4,
    additionalInfo: 31,
    reserved: false,
    indefinite: true,
  },
} satisfies ToolExample<Input, Output>;
export const cborAdditionalInfoReservedValueFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/cbor-additional-info-reserved-value-flag",
  title: "CBOR Additional Info Reserved Value Flag Tool",
  description:
    "Compute cbor additional info reserved value flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "octet",
        label: "Octet",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "majorType", label: "Major Type", valueType: { type: "integer" } },
      {
        id: "additionalInfo",
        label: "Additional Info",
        valueType: { type: "integer" },
      },
      { id: "reserved", label: "Reserved", valueType: { type: "boolean" } },
      { id: "indefinite", label: "Indefinite", valueType: { type: "boolean" } },
    ],
  },
});
export const run = cborAdditionalInfoReservedValueFlagTool.execute;
export default cborAdditionalInfoReservedValueFlagTool;
