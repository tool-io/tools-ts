import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly bytes: readonly number[];
  readonly finalGroup: boolean;
};
export type Output = { readonly eligible: boolean; readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
    finalGroup: { type: "boolean" },
  },
  required: ["bytes", "finalGroup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "boolean" },
    token: { type: "string", maxLength: 8192 },
  },
  required: ["eligible", "token"],
} as const;
/** Compute ascii85 zero shorthand eligibility from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bytes, finalGroup } = input;
  const compute = (): Output => {
    domain(
      bytes.length >= 1 &&
        bytes.length <= 4 &&
        bytes.every((x) => x >= 0 && x <= 255),
    );
    domain(bytes.length === 4 || finalGroup);
    const eligible = bytes.length === 4 && bytes.every((x) => x === 0);
    return { eligible, token: eligible ? "z" : "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bytes: [0, 0, 0, 0], finalGroup: false },
  output: { eligible: true, token: "z" },
} satisfies ToolExample<Input, Output>;
export const ascii85ZeroShorthandEligibilityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/ascii85-zero-shorthand-eligibility",
  title: "Ascii85 Zero Shorthand Eligibility Tool",
  description:
    "Compute ascii85 zero shorthand eligibility from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "finalGroup",
        label: "Final Group",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      { id: "token", label: "Token", valueType: { type: "string" } },
    ],
  },
});
export const run = ascii85ZeroShorthandEligibilityTool.execute;
export default ascii85ZeroShorthandEligibilityTool;
