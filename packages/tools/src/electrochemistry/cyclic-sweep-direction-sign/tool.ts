import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPotential: number;
  readonly currentPotential: number;
};
export type Output = { readonly direction: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPotential: { type: "number" },
    currentPotential: { type: "number" },
  },
  required: ["previousPotential", "currentPotential"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { direction: { type: "integer" }, delta: { type: "number" } },
  required: ["direction", "delta"],
} as const;
/** Calculate cyclic sweep direction sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousPotential, currentPotential } = request;
  const compute = (): Output => {
    return {
      direction: Math.sign(currentPotential - previousPotential),
      delta: currentPotential - previousPotential,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousPotential: 1, currentPotential: 2 },
  output: { direction: 1, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const cyclicSweepDirectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/cyclic-sweep-direction-sign",
    title: "Cyclic Sweep Direction Sign Tool",
    description:
      "Calculate cyclic sweep direction sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPotential: { type: "number" },
        currentPotential: { type: "number" },
      },
      required: ["previousPotential", "currentPotential"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { direction: { type: "integer" }, delta: { type: "number" } },
      required: ["direction", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "previousPotential",
          label: "Previous Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPotential",
          label: "Current Potential",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
        { id: "delta", label: "Delta", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cyclicSweepDirectionSignTool.execute;
export default cyclicSweepDirectionSignTool;
