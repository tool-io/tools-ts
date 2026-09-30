import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly start: number; readonly width: number };
export type Output = {
  readonly leftCenter: number;
  readonly rightCenter: number;
  readonly halfIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1 },
  },
  required: ["start", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCenter: { type: "integer" },
    rightCenter: { type: "integer" },
    halfIndex: { type: "number" },
  },
  required: ["leftCenter", "rightCenter", "halfIndex"],
} as const;
/** Compute list fixed window center anchor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { start, width } = input;
  const compute = (): Output => {
    integer(start);
    integer(width, 1);
    return {
      leftCenter: start + Math.floor((width - 1) / 2),
      rightCenter: start + Math.floor(width / 2),
      halfIndex: start + (width - 1) / 2,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: 10, width: 4 },
  output: { leftCenter: 11, rightCenter: 12, halfIndex: 11.5 },
} satisfies ToolExample<Input, Output>;
export const listFixedWindowCenterAnchorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-fixed-window-center-anchor",
  title: "List Fixed Window Center Anchor Tool",
  description:
    "Compute list fixed window center anchor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "start",
        label: "Start",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "leftCenter",
        label: "Left Center",
        valueType: { type: "integer" },
      },
      {
        id: "rightCenter",
        label: "Right Center",
        valueType: { type: "integer" },
      },
      { id: "halfIndex", label: "Half Index", valueType: { type: "number" } },
    ],
  },
});
export const run = listFixedWindowCenterAnchorTool.execute;
export default listFixedWindowCenterAnchorTool;
