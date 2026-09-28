import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly modulus: number;
};
export type Output = { readonly same: boolean; readonly forwardDelta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 2 },
  },
  required: ["previous", "current", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { same: { type: "boolean" }, forwardDelta: { type: "integer" } },
  required: ["same", "forwardDelta"],
} as const;
/** Calculate health device duplicate sequence counter from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, current, modulus } = request;
  const compute = (): Output => {
    H.integer(modulus, 2);
    H.integer(previous, 0, modulus - 1);
    H.integer(current, 0, modulus - 1);
    return {
      same: previous === current,
      forwardDelta: H.mod(current - previous, modulus),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: 254, current: 2, modulus: 256 },
  output: { same: false, forwardDelta: 4 },
} satisfies ToolExample<Input, Output>;
export const healthDeviceDuplicateSequenceCounterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/health-device-duplicate-sequence-counter",
      title: "Health Device Duplicate Sequence Counter Tool",
      description:
        "Calculate health device duplicate sequence counter from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previous: { type: "integer", minimum: 0 },
          current: { type: "integer", minimum: 0 },
          modulus: { type: "integer", minimum: 2 },
        },
        required: ["previous", "current", "modulus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          same: { type: "boolean" },
          forwardDelta: { type: "integer" },
        },
        required: ["same", "forwardDelta"],
      },
      ports: {
        inputs: [
          {
            id: "previous",
            label: "Previous",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "current",
            label: "Current",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "modulus",
            label: "Modulus",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "same", label: "Same", valueType: { type: "boolean" } },
          {
            id: "forwardDelta",
            label: "Forward Delta",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthDeviceDuplicateSequenceCounterTool.execute;
export default healthDeviceDuplicateSequenceCounterTool;
