import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly valid: boolean; readonly site: string };
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
    valid: { type: "boolean" },
    site: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "site"],
} as const;
/** Calculate http sec fetch site one token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const valid = ["same-origin", "same-site", "cross-site", "none"].includes(
      token,
    );
    return { valid, site: valid ? token : "invalid" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "cross-site" },
  output: { valid: true, site: "cross-site" },
} satisfies ToolExample<Input, Output>;
export const httpSecFetchSiteOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-sec-fetch-site-one-token",
    title: "HTTP Sec Fetch Site One Token Tool",
    description:
      "Calculate http sec fetch site one token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        site: { type: "string", maxLength: 8192 },
      },
      required: ["valid", "site"],
    },
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
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "site", label: "Site", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = httpSecFetchSiteOneTokenTool.execute;
export default httpSecFetchSiteOneTokenTool;
