import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly url: string };
export type Output = {
  readonly present: boolean;
  readonly empty: boolean;
  readonly fragment: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { url: { type: "string", maxLength: 8192 } },
  required: ["url"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    empty: { type: "boolean" },
    fragment: { type: "string", maxLength: 8192 },
  },
  required: ["present", "empty", "fragment"],
} as const;
/** Compute url fragment empty marker from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { url } = input;
  const compute = (): Output => {
    const i = url.indexOf("#");
    return {
      present: i >= 0,
      empty: i >= 0 && i === url.length - 1,
      fragment: i < 0 ? "" : url.slice(i + 1),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { url: "https://example.com/#" },
  output: { present: true, empty: true, fragment: "" },
} satisfies ToolExample<Input, Output>;
export const urlFragmentEmptyMarkerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/url-fragment-empty-marker",
  title: "URL Fragment Empty Marker Tool",
  description:
    "Compute url fragment empty marker from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "url",
        label: "Url",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "present", label: "Present", valueType: { type: "boolean" } },
      { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      { id: "fragment", label: "Fragment", valueType: { type: "string" } },
    ],
  },
});
export const run = urlFragmentEmptyMarkerTool.execute;
export default urlFragmentEmptyMarkerTool;
