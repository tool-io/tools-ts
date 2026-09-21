import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly prefix: string; readonly number: number };
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
    prefix: { type: "string", maxLength: 8192 },
    number: { type: "integer" },
  },
  required: ["prefix", "number"],
} as const;
/** Parse a three-uppercase-letter nonzero signed safe-integer ISOXML identifier subset; no document validation or registry lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([A-Z]{3})(-?[1-9]\d*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const number = Number(match[2]);
    H.integer(number, -Number.MAX_SAFE_INTEGER);
    return { prefix: match[1], number };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "TSK123" },
  output: { prefix: "TSK", number: 123 },
} satisfies ToolExample<Input, Output>;
export const machineryIsoxmlTaskIdFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/machinery-isoxml-task-id-field",
    title: "Machinery ISOXML Task ID Field Tool",
    description:
      "Parse a three-uppercase-letter nonzero signed safe-integer ISOXML identifier subset; no document validation or registry lookup.",
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
        prefix: { type: "string", maxLength: 8192 },
        number: { type: "integer" },
      },
      required: ["prefix", "number"],
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
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "number", label: "Number", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = machineryIsoxmlTaskIdFieldTool.execute;
export default machineryIsoxmlTaskIdFieldTool;
