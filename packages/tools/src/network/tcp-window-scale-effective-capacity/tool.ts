import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly window: number;
  readonly shift: number;
  readonly synSegment: boolean;
};
export type Output = { readonly effectiveWindow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    window: { type: "integer", minimum: 0, maximum: 65535 },
    shift: { type: "integer", minimum: 0, maximum: 14 },
    synSegment: { type: "boolean" },
  },
  required: ["window", "shift", "synSegment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveWindow: { type: "integer" } },
  required: ["effectiveWindow"],
} as const;
/** Calculate tcp window scale effective capacity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { window, shift, synSegment } = request;
  const compute = (): Output => {
    H.integer(window, 0, 65535);
    H.integer(shift, 0, 14);
    return { effectiveWindow: window * 2 ** (synSegment ? 0 : shift) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { window: 1000, shift: 4, synSegment: false },
  output: { effectiveWindow: 16000 },
} satisfies ToolExample<Input, Output>;
export const tcpWindowScaleEffectiveCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-window-scale-effective-capacity",
    title: "TCP Window Scale Effective Capacity Tool",
    description:
      "Calculate tcp window scale effective capacity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        window: { type: "integer", minimum: 0, maximum: 65535 },
        shift: { type: "integer", minimum: 0, maximum: 14 },
        synSegment: { type: "boolean" },
      },
      required: ["window", "shift", "synSegment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveWindow: { type: "integer" } },
      required: ["effectiveWindow"],
    },
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
          id: "synSegment",
          label: "Syn Segment",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveWindow",
          label: "Effective Window",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tcpWindowScaleEffectiveCapacityTool.execute;
export default tcpWindowScaleEffectiveCapacityTool;
