import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly name: string;
  readonly value: string;
  readonly hasEquals: boolean;
};
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
    value: { type: "string", maxLength: 8192 },
    hasEquals: { type: "boolean" },
  },
  required: ["name", "value", "hasEquals"],
} as const;
/** Calculate uri query empty value equals marker from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(!/[&#?]/.test(token));
    const i = token.indexOf("=");
    return {
      name: i < 0 ? token : token.slice(0, i),
      value: i < 0 ? "" : token.slice(i + 1),
      hasEquals: i >= 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "flag=" },
  output: { name: "flag", value: "", hasEquals: true },
} satisfies ToolExample<Input, Output>;
export const uriQueryEmptyValueEqualsMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/uri-query-empty-value-equals-marker",
    title: "URI Query Empty Value Equals Marker Tool",
    description:
      "Calculate uri query empty value equals marker from explicit caller-supplied inputs.",
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
        value: { type: "string", maxLength: 8192 },
        hasEquals: { type: "boolean" },
      },
      required: ["name", "value", "hasEquals"],
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
        { id: "value", label: "Value", valueType: { type: "string" } },
        {
          id: "hasEquals",
          label: "Has Equals",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = uriQueryEmptyValueEqualsMarkerTool.execute;
export default uriQueryEmptyValueEqualsMarkerTool;
