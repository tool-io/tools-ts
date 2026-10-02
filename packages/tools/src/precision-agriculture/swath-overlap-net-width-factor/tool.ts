import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalWidth: number;
  readonly overlaps: readonly number[];
  readonly sections: number;
};
export type Output = { readonly netWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalWidth: { type: "number", exclusiveMinimum: 0 },
    overlaps: { type: "array", maxItems: 256, items: { type: "number" } },
    sections: { type: "integer", minimum: 1 },
  },
  required: ["nominalWidth", "overlaps", "sections"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netWidth: { type: "number" } },
  required: ["netWidth"],
} as const;
/** Calculate swath overlap net width factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalWidth, overlaps, sections } = request;
  const compute = (): Output => {
    H.integer(sections, 1);
    H.domain(
      nominalWidth > 0 &&
        overlaps.length === sections - 1 &&
        overlaps.every((x) => x >= 0 && x <= nominalWidth),
    );
    return {
      netWidth: nominalWidth * sections - overlaps.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalWidth: 5, overlaps: [0.2, 0.3], sections: 3 },
  output: { netWidth: 14.5 },
} satisfies ToolExample<Input, Output>;
export const swathOverlapNetWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/swath-overlap-net-width-factor",
    title: "Swath Overlap Net Width Factor Tool",
    description:
      "Calculate swath overlap net width factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalWidth: { type: "number", exclusiveMinimum: 0 },
        overlaps: { type: "array", maxItems: 256, items: { type: "number" } },
        sections: { type: "integer", minimum: 1 },
      },
      required: ["nominalWidth", "overlaps", "sections"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netWidth: { type: "number" } },
      required: ["netWidth"],
    },
    ports: {
      inputs: [
        {
          id: "nominalWidth",
          label: "Nominal Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlaps",
          label: "Overlaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sections",
          label: "Sections",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "netWidth", label: "Net Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = swathOverlapNetWidthFactorTool.execute;
export default swathOverlapNetWidthFactorTool;
