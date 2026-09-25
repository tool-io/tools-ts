import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly fields: readonly number[] };
export type Output = { readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fields: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["fields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kind: { type: "string", maxLength: 8192 } },
  required: ["kind"],
} as const;
/** Compute source map segment field count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { fields } = input;
  const compute = (): Output => {
    domain([1, 4, 5].includes(fields.length));
    return {
      kind:
        fields.length === 1
          ? "unmapped"
          : fields.length === 4
            ? "mapped"
            : "named",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { fields: [3] },
  output: { kind: "unmapped" },
} satisfies ToolExample<Input, Output>;
export const sourceMapSegmentFieldCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/source-map-segment-field-count",
  title: "Source Map Segment Field Count Tool",
  description:
    "Compute source map segment field count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "fields",
        label: "Fields",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [{ id: "kind", label: "Kind", valueType: { type: "string" } }],
  },
});
export const run = sourceMapSegmentFieldCountTool.execute;
export default sourceMapSegmentFieldCountTool;
