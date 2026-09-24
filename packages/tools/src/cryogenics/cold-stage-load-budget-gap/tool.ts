import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parasiticLoads: readonly number[];
  readonly activeLoads: readonly number[];
  readonly suppliedCapacity: number;
};
export type Output = {
  readonly parasiticTotal: number;
  readonly activeTotal: number;
  readonly headroom: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parasiticLoads: { type: "array", maxItems: 256, items: { type: "number" } },
    activeLoads: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedCapacity: { type: "number", minimum: 0 },
  },
  required: ["parasiticLoads", "activeLoads", "suppliedCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parasiticTotal: { type: "number" },
    activeTotal: { type: "number" },
    headroom: { type: "number" },
  },
  required: ["parasiticTotal", "activeTotal", "headroom"],
} as const;
/** Balance explicit bench cold-stage loads against supplied capacity, without selecting equipment or safety margins. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parasiticLoads, activeLoads, suppliedCapacity } = request;
  const compute = (): Output => {
    H.domain(
      [...parasiticLoads, ...activeLoads].every((x) => x >= 0) &&
        suppliedCapacity >= 0,
    );
    return (() => {
      const parasiticTotal = parasiticLoads.reduce((a, b) => a + b, 0),
        activeTotal = activeLoads.reduce((a, b) => a + b, 0);
      return {
        parasiticTotal,
        activeTotal,
        headroom: suppliedCapacity - parasiticTotal - activeTotal,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parasiticLoads: [1, 2], activeLoads: [3, 4], suppliedCapacity: 12 },
  output: { parasiticTotal: 3, activeTotal: 7, headroom: 2 },
} satisfies ToolExample<Input, Output>;
export const coldStageLoadBudgetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cold-stage-load-budget-gap",
    title: "Cold Stage Load Budget Gap Tool",
    description:
      "Balance explicit bench cold-stage loads against supplied capacity, without selecting equipment or safety margins.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parasiticLoads: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        activeLoads: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedCapacity: { type: "number", minimum: 0 },
      },
      required: ["parasiticLoads", "activeLoads", "suppliedCapacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parasiticTotal: { type: "number" },
        activeTotal: { type: "number" },
        headroom: { type: "number" },
      },
      required: ["parasiticTotal", "activeTotal", "headroom"],
    },
    ports: {
      inputs: [
        {
          id: "parasiticLoads",
          label: "Parasitic Loads",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "activeLoads",
          label: "Active Loads",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedCapacity",
          label: "Supplied Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "parasiticTotal",
          label: "Parasitic Total",
          valueType: { type: "number" },
        },
        {
          id: "activeTotal",
          label: "Active Total",
          valueType: { type: "number" },
        },
        { id: "headroom", label: "Headroom", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coldStageLoadBudgetGapTool.execute;
export default coldStageLoadBudgetGapTool;
