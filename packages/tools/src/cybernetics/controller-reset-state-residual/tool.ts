import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateBefore: readonly number[];
  readonly suppliedReset: readonly number[];
  readonly desiredState: readonly number[];
  readonly resetIsIncrement: boolean;
};
export type Output = {
  readonly stateAfter: readonly number[];
  readonly residual: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateBefore: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedReset: { type: "array", maxItems: 256, items: { type: "number" } },
    desiredState: { type: "array", maxItems: 256, items: { type: "number" } },
    resetIsIncrement: { type: "boolean" },
  },
  required: [
    "stateBefore",
    "suppliedReset",
    "desiredState",
    "resetIsIncrement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateAfter: { type: "array", maxItems: 256, items: { type: "number" } },
    residual: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["stateAfter", "residual"],
} as const;
/** Calculate controller reset state residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateBefore, suppliedReset, desiredState, resetIsIncrement } =
    request;
  const compute = (): Output => {
    H.sameLength(stateBefore, suppliedReset);
    H.sameLength(stateBefore, desiredState);
    return (() => {
      const stateAfter = stateBefore.map((x, i) =>
        resetIsIncrement ? x + suppliedReset[i] : suppliedReset[i],
      );
      return {
        stateAfter,
        residual: stateAfter.map((x, i) => x - desiredState[i]),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stateBefore: [1, 2],
    suppliedReset: [2, -1],
    desiredState: [3, 0],
    resetIsIncrement: true,
  },
  output: { stateAfter: [3, 1], residual: [0, 1] },
} satisfies ToolExample<Input, Output>;
export const controllerResetStateResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/controller-reset-state-residual",
    title: "Controller Reset State Residual Tool",
    description:
      "Calculate controller reset state residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateBefore: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedReset: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        desiredState: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        resetIsIncrement: { type: "boolean" },
      },
      required: [
        "stateBefore",
        "suppliedReset",
        "desiredState",
        "resetIsIncrement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateAfter: { type: "array", maxItems: 256, items: { type: "number" } },
        residual: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["stateAfter", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "stateBefore",
          label: "State Before",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedReset",
          label: "Supplied Reset",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "desiredState",
          label: "Desired State",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "resetIsIncrement",
          label: "Reset Is Increment",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "stateAfter",
          label: "State After",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "residual",
          label: "Residual",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = controllerResetStateResidualTool.execute;
export default controllerResetStateResidualTool;
