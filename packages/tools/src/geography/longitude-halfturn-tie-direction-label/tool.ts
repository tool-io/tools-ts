import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly from: number;
  readonly to: number;
  readonly preferEast: boolean;
};
export type Output = { readonly difference: number; readonly tied: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    from: { type: "number" },
    to: { type: "number" },
    preferEast: { type: "boolean" },
  },
  required: ["from", "to", "preferEast"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" }, tied: { type: "boolean" } },
  required: ["difference", "tied"],
} as const;
/** Calculate longitude halfturn tie direction label from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { from, to, preferEast } = input;
  const compute = (): Output => {
    const raw = H.mod(to - from, 360),
      tied = raw === 180;
    return {
      difference: tied
        ? preferEast
          ? 180
          : -180
        : raw > 180
          ? raw - 360
          : raw,
      tied,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { from: 0, to: 180, preferEast: false },
  output: { difference: -180, tied: true },
} satisfies ToolExample<Input, Output>;
export const longitudeHalfturnTieDirectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/longitude-halfturn-tie-direction-label",
    title: "Longitude Halfturn Tie Direction Label Tool",
    description:
      "Calculate longitude halfturn tie direction label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        from: { type: "number" },
        to: { type: "number" },
        preferEast: { type: "boolean" },
      },
      required: ["from", "to", "preferEast"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" }, tied: { type: "boolean" } },
      required: ["difference", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "from",
          label: "From",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "to",
          label: "To",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preferEast",
          label: "Prefer East",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = longitudeHalfturnTieDirectionLabelTool.execute;
export default longitudeHalfturnTieDirectionLabelTool;
