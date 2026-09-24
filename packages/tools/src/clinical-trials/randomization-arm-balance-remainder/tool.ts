import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assigned: readonly number[];
  readonly blockTarget: readonly number[];
};
export type Output = {
  readonly remaining: readonly number[];
  readonly overallocatedPositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assigned: { type: "array", maxItems: 256, items: { type: "integer" } },
    blockTarget: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["assigned", "blockTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "array", maxItems: 256, items: { type: "integer" } },
    overallocatedPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["remaining", "overallocatedPositions"],
} as const;
/** Audit supplied arm-count targets; does not generate or reveal allocation sequences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assigned, blockTarget } = request;
  const compute = (): Output => {
    H.sameLength(assigned, blockTarget);
    H.domain(assigned.every((x) => x >= 0) && blockTarget.every((x) => x >= 0));
    const remaining = blockTarget.map((x, i) => x - assigned[i]);
    return {
      remaining,
      overallocatedPositions: remaining.flatMap((x, i) => (x < 0 ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assigned: [5, 3], blockTarget: [4, 4] },
  output: { remaining: [-1, 1], overallocatedPositions: [0] },
} satisfies ToolExample<Input, Output>;
export const randomizationArmBalanceRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/randomization-arm-balance-remainder",
    title: "Randomization Arm Balance Remainder Tool",
    description:
      "Audit supplied arm-count targets; does not generate or reveal allocation sequences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assigned: { type: "array", maxItems: 256, items: { type: "integer" } },
        blockTarget: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["assigned", "blockTarget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "array", maxItems: 256, items: { type: "integer" } },
        overallocatedPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["remaining", "overallocatedPositions"],
    },
    ports: {
      inputs: [
        {
          id: "assigned",
          label: "Assigned",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "blockTarget",
          label: "Block Target",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "remaining",
          label: "Remaining",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "overallocatedPositions",
          label: "Overallocated Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = randomizationArmBalanceRemainderTool.execute;
export default randomizationArmBalanceRemainderTool;
