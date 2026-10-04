import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly sameSite: string; readonly secure: boolean };
export type Output = {
  readonly requiresSecure: boolean;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSite: {
      type: "string",
      maxLength: 8192,
      enum: ["Strict", "Lax", "None", "unspecified"],
    },
    secure: { type: "boolean" },
  },
  required: ["sameSite", "secure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiresSecure: { type: "boolean" },
    valid: { type: "boolean" },
  },
  required: ["requiresSecure", "valid"],
} as const;
/** Compute cookie samesite none secure pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sameSite, secure } = input;
  const compute = (): Output => {
    domain(["Strict", "Lax", "None", "unspecified"].includes(sameSite));
    return {
      requiresSecure: sameSite === "None",
      valid: sameSite !== "None" || secure,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sameSite: "None", secure: false },
  output: { requiresSecure: true, valid: false },
} satisfies ToolExample<Input, Output>;
export const cookieSamesiteNoneSecurePairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/cookie-samesite-none-secure-pair",
  title: "Cookie Samesite None Secure Pair Tool",
  description:
    "Compute cookie samesite none secure pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sameSite",
        label: "Same Site",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "secure",
        label: "Secure",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "requiresSecure",
        label: "Requires Secure",
        valueType: { type: "boolean" },
      },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = cookieSamesiteNoneSecurePairTool.execute;
export default cookieSamesiteNoneSecurePairTool;
