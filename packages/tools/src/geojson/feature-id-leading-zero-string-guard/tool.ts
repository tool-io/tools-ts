import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly idJson: string };
export type Output = {
  readonly stringId: boolean;
  readonly losesZerosIfNumeric: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { idJson: { type: "string", maxLength: 8192 } },
  required: ["idJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stringId: { type: "boolean" },
    losesZerosIfNumeric: { type: "boolean" },
  },
  required: ["stringId", "losesZerosIfNumeric"],
} as const;
/** Compute feature id leading zero string guard from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { idJson } = input;
  const compute = (): Output => {
    const v = parseJson(idJson);
    domain(typeof v === "string" || typeof v === "number");
    return {
      stringId: typeof v === "string",
      losesZerosIfNumeric: typeof v === "string" && /^0\d+(?![\s\S])/.test(v),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { idJson: '"0012"' },
  output: { stringId: true, losesZerosIfNumeric: true },
} satisfies ToolExample<Input, Output>;
export const featureIdLeadingZeroStringGuardTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/feature-id-leading-zero-string-guard",
  title: "Feature ID Leading Zero String Guard Tool",
  description:
    "Compute feature id leading zero string guard from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "idJson",
        label: "Id Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "stringId", label: "String Id", valueType: { type: "boolean" } },
      {
        id: "losesZerosIfNumeric",
        label: "Loses Zeros If Numeric",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = featureIdLeadingZeroStringGuardTool.execute;
export default featureIdLeadingZeroStringGuardTool;
