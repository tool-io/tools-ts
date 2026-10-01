import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly window: number;
  readonly shift: number;
  readonly syn: boolean;
};
export type Output = { readonly effectiveBytes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    window: { type: "integer", minimum: 0, maximum: 65535 },
    shift: { type: "integer", minimum: 0, maximum: 14 },
    syn: { type: "boolean" },
  },
  required: ["window", "shift", "syn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveBytes: { type: "number" } },
  required: ["effectiveBytes"],
} as const;
/** Compute tcp window scaling one direction from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { window, shift, syn } = input;
  const compute = (): Output => {
    integer(window, 0, 65535);
    integer(shift, 0, 14);
    return { effectiveBytes: window * 2 ** (syn ? 0 : shift) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { window: 1000, shift: 4, syn: false },
  output: { effectiveBytes: 16000 },
} satisfies ToolExample<Input, Output>;
export const tcpWindowScalingOneDirectionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/tcp-window-scaling-one-direction",
  title: "TCP Window Scaling One Direction Tool",
  description:
    "Compute tcp window scaling one direction from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "window",
        label: "Window",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "shift",
        label: "Shift",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "syn",
        label: "Syn",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "effectiveBytes",
        label: "Effective Bytes",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = tcpWindowScalingOneDirectionTool.execute;
export default tcpWindowScalingOneDirectionTool;
