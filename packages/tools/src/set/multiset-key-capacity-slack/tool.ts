import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly keys: readonly string[];
  readonly counts: readonly number[];
  readonly capacities: readonly number[];
};
export type Output = {
  readonly slacks: readonly number[];
  readonly allWithinCapacity: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    counts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    capacities: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["keys", "counts", "capacities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
    allWithinCapacity: { type: "boolean" },
  },
  required: ["slacks", "allWithinCapacity"],
} as const;
/** Calculate multiset key capacity slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { keys, counts, capacities } = request;
  const compute = (): Output => {
    H.sameLength(keys, counts);
    H.sameLength(keys, capacities);
    H.domain(
      new Set(keys).size === keys.length &&
        counts.every((x) => x >= 0) &&
        capacities.every((x) => x >= 0),
    );
    const slacks = capacities.map((x, i) => x - counts[i]);
    return { slacks, allWithinCapacity: slacks.every((x) => x >= 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { keys: ["a", "b"], counts: [2, 5], capacities: [3, 4] },
  output: { slacks: [1, -1], allWithinCapacity: false },
} satisfies ToolExample<Input, Output>;
export const multisetKeyCapacitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/multiset-key-capacity-slack",
    title: "Multiset Key Capacity Slack Tool",
    description:
      "Calculate multiset key capacity slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        keys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        counts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        capacities: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["keys", "counts", "capacities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slacks: { type: "array", maxItems: 256, items: { type: "integer" } },
        allWithinCapacity: { type: "boolean" },
      },
      required: ["slacks", "allWithinCapacity"],
    },
    ports: {
      inputs: [
        {
          id: "keys",
          label: "Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "capacities",
          label: "Capacities",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "slacks",
          label: "Slacks",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "allWithinCapacity",
          label: "All Within Capacity",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = multisetKeyCapacitySlackTool.execute;
export default multisetKeyCapacitySlackTool;
