import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly name: string; readonly state: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    state: { type: "string", maxLength: 8192 },
  },
  required: ["name", "state"],
} as const;
/** Compute git attribute unset vs unspecified token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^([-!]?)([A-Za-z0-9_][A-Za-z0-9_.-]*)(?:=(\S+))?(?![\s\S])/.exec(
      token,
    );
    domain(m && !(m[1] && m[3]));
    return {
      name: m[2],
      state:
        m[1] === "-"
          ? "unset"
          : m[1] === "!"
            ? "unspecified"
            : m[3] !== undefined
              ? "value"
              : "set",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "-diff" },
  output: { name: "diff", state: "unset" },
} satisfies ToolExample<Input, Output>;
export const gitAttributeUnsetVsUnspecifiedTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/git-attribute-unset-vs-unspecified-token",
  title: "Git Attribute Unset Vs Unspecified Token Tool",
  description:
    "Compute git attribute unset vs unspecified token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "name", label: "Name", valueType: { type: "string" } },
      { id: "state", label: "State", valueType: { type: "string" } },
    ],
  },
});
export const run = gitAttributeUnsetVsUnspecifiedTokenTool.execute;
export default gitAttributeUnsetVsUnspecifiedTokenTool;
