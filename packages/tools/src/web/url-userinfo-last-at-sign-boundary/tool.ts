import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly authority: string };
export type Output = {
  readonly userinfo: string;
  readonly hostPort: string;
  readonly present: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { authority: { type: "string", maxLength: 8192 } },
  required: ["authority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    userinfo: { type: "string", maxLength: 8192 },
    hostPort: { type: "string", maxLength: 8192 },
    present: { type: "boolean" },
  },
  required: ["userinfo", "hostPort", "present"],
} as const;
/** Compute url userinfo last at sign boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { authority } = input;
  const compute = (): Output => {
    domain(!/[\r\n/?#]/.test(authority));
    const i = authority.lastIndexOf("@");
    return {
      userinfo: i < 0 ? "" : authority.slice(0, i),
      hostPort: authority.slice(i + 1),
      present: i >= 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { authority: "user@name@example.com:80" },
  output: { userinfo: "user@name", hostPort: "example.com:80", present: true },
} satisfies ToolExample<Input, Output>;
export const urlUserinfoLastAtSignBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/url-userinfo-last-at-sign-boundary",
  title: "URL Userinfo Last At Sign Boundary Tool",
  description:
    "Compute url userinfo last at sign boundary from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "authority",
        label: "Authority",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "userinfo", label: "Userinfo", valueType: { type: "string" } },
      { id: "hostPort", label: "Host Port", valueType: { type: "string" } },
      { id: "present", label: "Present", valueType: { type: "boolean" } },
    ],
  },
});
export const run = urlUserinfoLastAtSignBoundaryTool.execute;
export default urlUserinfoLastAtSignBoundaryTool;
