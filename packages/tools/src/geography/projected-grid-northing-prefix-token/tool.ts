import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zone: string;
  readonly northing: string;
  readonly separator: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zone: { type: "string", maxLength: 8192 },
    northing: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["zone", "northing", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate projected grid northing prefix token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { zone, northing, separator } = input;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z0-9-]+(?![\s\S])/.test(zone) &&
        /^[+-]?\d+(?:\.\d+)?(?![\s\S])/.test(northing) &&
        !/[\r\n]/.test(separator),
    );
    return { text: zone + separator + northing };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { zone: "32N", northing: "5800000", separator: " " },
  output: { text: "32N 5800000" },
} satisfies ToolExample<Input, Output>;
export const projectedGridNorthingPrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/projected-grid-northing-prefix-token",
    title: "Projected Grid Northing Prefix Token Tool",
    description:
      "Calculate projected grid northing prefix token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zone: { type: "string", maxLength: 8192 },
        northing: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["zone", "northing", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "zone",
          label: "Zone",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "northing",
          label: "Northing",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = projectedGridNorthingPrefixTokenTool.execute;
export default projectedGridNorthingPrefixTokenTool;
