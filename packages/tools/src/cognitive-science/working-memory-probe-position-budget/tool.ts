import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly setSize: number;
  readonly probePosition: number;
  readonly zeroBased: boolean;
};
export type Output = {
  readonly index: number;
  readonly valid: boolean;
  readonly remainingItems: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setSize: { type: "integer", minimum: 0 },
    probePosition: { type: "integer", minimum: 0 },
    zeroBased: { type: "boolean" },
  },
  required: ["setSize", "probePosition", "zeroBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    valid: { type: "boolean" },
    remainingItems: { type: "integer" },
  },
  required: ["index", "valid", "remainingItems"],
} as const;
/** Calculate working memory probe position budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { setSize, probePosition, zeroBased } = request;
  const compute = (): Output => {
    H.integer(setSize, 0);
    H.integer(probePosition, 0);
    return {
      index: probePosition - (zeroBased ? 0 : 1),
      valid:
        probePosition - (zeroBased ? 0 : 1) >= 0 &&
        probePosition - (zeroBased ? 0 : 1) < setSize,
      remainingItems: setSize - (probePosition - (zeroBased ? 0 : 1)) - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { setSize: 5, probePosition: 3, zeroBased: false },
  output: { index: 2, valid: true, remainingItems: 2 },
} satisfies ToolExample<Input, Output>;
export const workingMemoryProbePositionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/working-memory-probe-position-budget",
    title: "Working Memory Probe Position Budget Tool",
    description:
      "Calculate working memory probe position budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        setSize: { type: "integer", minimum: 0 },
        probePosition: { type: "integer", minimum: 0 },
        zeroBased: { type: "boolean" },
      },
      required: ["setSize", "probePosition", "zeroBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        valid: { type: "boolean" },
        remainingItems: { type: "integer" },
      },
      required: ["index", "valid", "remainingItems"],
    },
    ports: {
      inputs: [
        {
          id: "setSize",
          label: "Set Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "probePosition",
          label: "Probe Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "zeroBased",
          label: "Zero Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "remainingItems",
          label: "Remaining Items",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = workingMemoryProbePositionBudgetTool.execute;
export default workingMemoryProbePositionBudgetTool;
