import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly center: number; readonly width: number };
export type Output = {
  readonly start: number;
  readonly endExclusive: number;
  readonly centeredExactly: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1 },
  },
  required: ["center", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer" },
    endExclusive: { type: "integer" },
    centeredExactly: { type: "boolean" },
  },
  required: ["start", "endExclusive", "centeredExactly"],
} as const;
/** Compute sequence index centered window parity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { center, width } = input;
  const compute = (): Output => {
    integer(center);
    integer(width, 1);
    const start = center - Math.floor((width - 1) / 2);
    domain(start >= 0);
    return {
      start,
      endExclusive: start + width,
      centeredExactly: width % 2 === 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { center: 5, width: 3 },
  output: { start: 4, endExclusive: 7, centeredExactly: true },
} satisfies ToolExample<Input, Output>;
export const sequenceIndexCenteredWindowParityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/sequence-index-centered-window-parity",
  title: "Sequence Index Centered Window Parity Tool",
  description:
    "Compute sequence index centered window parity from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "center",
        label: "Center",
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
      { id: "start", label: "Start", valueType: { type: "integer" } },
      {
        id: "endExclusive",
        label: "End Exclusive",
        valueType: { type: "integer" },
      },
      {
        id: "centeredExactly",
        label: "Centered Exactly",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = sequenceIndexCenteredWindowParityTool.execute;
export default sequenceIndexCenteredWindowParityTool;
