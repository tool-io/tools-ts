import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly added: number;
  readonly drained: number;
  readonly evaporated: number;
  readonly capacity: number;
};
export type Output = { readonly remaining: number; readonly overflow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    added: { type: "number", minimum: 0 },
    drained: { type: "number", minimum: 0 },
    evaporated: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["initial", "added", "drained", "evaporated", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, overflow: { type: "number" } },
  required: ["remaining", "overflow"],
} as const;
/** Calculate balcony planter drain residual volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, added, drained, evaporated, capacity } = request;
  const compute = (): Output => {
    H.domain(
      initial >= 0 &&
        added >= 0 &&
        drained >= 0 &&
        evaporated >= 0 &&
        drained + evaporated <= initial + added &&
        capacity >= 0,
    );
    return {
      remaining: initial + added - drained - evaporated,
      overflow: Math.max(0, initial + added - drained - evaporated - capacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 5, added: 10, drained: 3, evaporated: 1, capacity: 8 },
  output: { remaining: 11, overflow: 3 },
} satisfies ToolExample<Input, Output>;
export const balconyPlanterDrainResidualVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/balcony-planter-drain-residual-volume",
    title: "Balcony Planter Drain Residual Volume Tool",
    description:
      "Calculate balcony planter drain residual volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "number", minimum: 0 },
        added: { type: "number", minimum: 0 },
        drained: { type: "number", minimum: 0 },
        evaporated: { type: "number", minimum: 0 },
        capacity: { type: "number", minimum: 0 },
      },
      required: ["initial", "added", "drained", "evaporated", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        overflow: { type: "number" },
      },
      required: ["remaining", "overflow"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "added",
          label: "Added",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drained",
          label: "Drained",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporated",
          label: "Evaporated",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "overflow", label: "Overflow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = balconyPlanterDrainResidualVolumeTool.execute;
export default balconyPlanterDrainResidualVolumeTool;
