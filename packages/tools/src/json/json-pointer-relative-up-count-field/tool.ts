import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly pointer: string };
export type Output = {
  readonly up: number;
  readonly remainder: string;
  readonly indexQuery: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    up: { type: "integer" },
    remainder: { type: "string", maxLength: 8192 },
    indexQuery: { type: "boolean" },
  },
  required: ["up", "remainder", "indexQuery"],
} as const;
/** Compute json pointer relative up count field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { pointer } = input;
  const compute = (): Output => {
    const m = /^(0|[1-9]\d{0,8})(#|(?:\/(?:[^~]|~[01])*)?)(?![\s\S])/.exec(
      pointer,
    );
    domain(m);
    return { up: Number(m[1]), remainder: m[2], indexQuery: m[2] === "#" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pointer: "2/foo" },
  output: { up: 2, remainder: "/foo", indexQuery: false },
} satisfies ToolExample<Input, Output>;
export const jsonPointerRelativeUpCountFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-pointer-relative-up-count-field",
  title: "JSON Pointer Relative Up Count Field Tool",
  description:
    "Compute json pointer relative up count field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "pointer",
        label: "Pointer",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "up", label: "Up", valueType: { type: "integer" } },
      { id: "remainder", label: "Remainder", valueType: { type: "string" } },
      {
        id: "indexQuery",
        label: "Index Query",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = jsonPointerRelativeUpCountFieldTool.execute;
export default jsonPointerRelativeUpCountFieldTool;
