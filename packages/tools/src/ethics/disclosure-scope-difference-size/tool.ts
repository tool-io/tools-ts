import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: readonly string[];
  readonly disclosed: readonly string[];
};
export type Output = { readonly missing: number; readonly extra: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    disclosed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "disclosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missing: { type: "integer" }, extra: { type: "integer" } },
  required: ["missing", "extra"],
} as const;
/** Calculate disclosure scope difference size from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, disclosed } = request;
  const compute = (): Output => {
    return {
      missing: new Set(required.filter((x) => !disclosed.includes(x))).size,
      extra: new Set(disclosed.filter((x) => !required.includes(x))).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: ["a", "b"], disclosed: ["b", "c"] },
  output: { missing: 1, extra: 1 },
} satisfies ToolExample<Input, Output>;
export const disclosureScopeDifferenceSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/disclosure-scope-difference-size",
    title: "Disclosure Scope Difference Size Tool",
    description:
      "Calculate disclosure scope difference size from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        disclosed: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["required", "disclosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missing: { type: "integer" }, extra: { type: "integer" } },
      required: ["missing", "extra"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "disclosed",
          label: "Disclosed",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        { id: "extra", label: "Extra", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = disclosureScopeDifferenceSizeTool.execute;
export default disclosureScopeDifferenceSizeTool;
