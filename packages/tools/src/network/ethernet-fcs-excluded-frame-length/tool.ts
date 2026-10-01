import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly frameBytes: number;
  readonly includesFcs: boolean;
};
export type Output = { readonly withoutFcs: number; readonly withFcs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameBytes: { type: "integer" },
    includesFcs: { type: "boolean" },
  },
  required: ["frameBytes", "includesFcs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withoutFcs: { type: "integer" }, withFcs: { type: "integer" } },
  required: ["withoutFcs", "withFcs"],
} as const;
/** Compute ethernet fcs excluded frame length from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { frameBytes, includesFcs } = input;
  const compute = (): Output => {
    integer(frameBytes, includesFcs ? 4 : 0);
    return {
      withoutFcs: frameBytes - (includesFcs ? 4 : 0),
      withFcs: frameBytes + (includesFcs ? 0 : 4),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { frameBytes: 64, includesFcs: true },
  output: { withoutFcs: 60, withFcs: 64 },
} satisfies ToolExample<Input, Output>;
export const ethernetFcsExcludedFrameLengthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ethernet-fcs-excluded-frame-length",
  title: "Ethernet Fcs Excluded Frame Length Tool",
  description:
    "Compute ethernet fcs excluded frame length from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "frameBytes",
        label: "Frame Bytes",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "includesFcs",
        label: "Includes Fcs",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "withoutFcs",
        label: "Without Fcs",
        valueType: { type: "integer" },
      },
      { id: "withFcs", label: "With Fcs", valueType: { type: "integer" } },
    ],
  },
});
export const run = ethernetFcsExcludedFrameLengthTool.execute;
export default ethernetFcsExcludedFrameLengthTool;
