import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstJson: string; readonly secondJson: string };
export type Output = { readonly equal: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstJson: { type: "string", maxLength: 8192 },
    secondJson: { type: "string", maxLength: 8192 },
  },
  required: ["firstJson", "secondJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equal: { type: "boolean" } },
  required: ["equal"],
} as const;
/** Calculate json patch test number string type inequality from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstJson, secondJson } = input;
  const compute = (): Output => {
    const a = H.parseJson(firstJson),
      b = H.parseJson(secondJson);
    H.domain(
      (a === null || typeof a !== "object") &&
        (b === null || typeof b !== "object"),
    );
    return { equal: a === b };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstJson: "1", secondJson: '"1"' },
  output: { equal: false },
} satisfies ToolExample<Input, Output>;
export const jsonPatchTestNumberStringTypeInequalityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "json/json-patch-test-number-string-type-inequality",
      title: "JSON Patch Test Number String Type Inequality Tool",
      description:
        "Calculate json patch test number string type inequality from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstJson: { type: "string", maxLength: 8192 },
          secondJson: { type: "string", maxLength: 8192 },
        },
        required: ["firstJson", "secondJson"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { equal: { type: "boolean" } },
        required: ["equal"],
      },
      ports: {
        inputs: [
          {
            id: "firstJson",
            label: "First Json",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondJson",
            label: "Second Json",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "equal", label: "Equal", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = jsonPatchTestNumberStringTypeInequalityTool.execute;
export default jsonPatchTestNumberStringTypeInequalityTool;
