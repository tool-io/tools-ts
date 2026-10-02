import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly name: string; readonly predefined: boolean };
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
    predefined: { type: "boolean" },
  },
  required: ["name", "predefined"],
} as const;
/** Calculate xml entity reference name token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const r = /^&([A-Za-z_][A-Za-z0-9_.:-]*);(?![\s\S])/.exec(token);
    H.domain(r !== null);
    return {
      name: r[1],
      predefined: ["amp", "lt", "gt", "apos", "quot"].includes(r[1]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "&amp;" },
  output: { name: "amp", predefined: true },
} satisfies ToolExample<Input, Output>;
export const xmlEntityReferenceNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/xml-entity-reference-name-token",
    title: "XML Entity Reference Name Token Tool",
    description:
      "Calculate xml entity reference name token from explicit caller-supplied inputs.",
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
        name: { type: "string", maxLength: 8192 },
        predefined: { type: "boolean" },
      },
      required: ["name", "predefined"],
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
        { id: "name", label: "Name", valueType: { type: "string" } },
        {
          id: "predefined",
          label: "Predefined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = xmlEntityReferenceNameTokenTool.execute;
export default xmlEntityReferenceNameTokenTool;
