import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supply: number;
  readonly capturedByLevel: readonly number[];
  readonly returnFlow: number;
};
export type Output = {
  readonly retainedTotal: number;
  readonly unaccounted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supply: { type: "number", minimum: 0 },
    capturedByLevel: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    returnFlow: { type: "number", minimum: 0 },
  },
  required: ["supply", "capturedByLevel", "returnFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedTotal: { type: "number" },
    unaccounted: { type: "number" },
  },
  required: ["retainedTotal", "unaccounted"],
} as const;
/** Calculate stacked tray irrigation per level balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supply, capturedByLevel, returnFlow } = request;
  const compute = (): Output => {
    H.domain(
      supply >= 0 && returnFlow >= 0 && capturedByLevel.every((x) => x >= 0),
    );
    return {
      retainedTotal: capturedByLevel.reduce((a, b) => a + b, 0),
      unaccounted:
        supply - returnFlow - capturedByLevel.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supply: 100, capturedByLevel: [10, 20, 15], returnFlow: 50 },
  output: { retainedTotal: 45, unaccounted: 5 },
} satisfies ToolExample<Input, Output>;
export const stackedTrayIrrigationPerLevelBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/stacked-tray-irrigation-per-level-balance",
      title: "Stacked Tray Irrigation Per Level Balance Tool",
      description:
        "Calculate stacked tray irrigation per level balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          supply: { type: "number", minimum: 0 },
          capturedByLevel: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          returnFlow: { type: "number", minimum: 0 },
        },
        required: ["supply", "capturedByLevel", "returnFlow"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedTotal: { type: "number" },
          unaccounted: { type: "number" },
        },
        required: ["retainedTotal", "unaccounted"],
      },
      ports: {
        inputs: [
          {
            id: "supply",
            label: "Supply",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capturedByLevel",
            label: "Captured By Level",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "returnFlow",
            label: "Return Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retainedTotal",
            label: "Retained Total",
            valueType: { type: "number" },
          },
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = stackedTrayIrrigationPerLevelBalanceTool.execute;
export default stackedTrayIrrigationPerLevelBalanceTool;
