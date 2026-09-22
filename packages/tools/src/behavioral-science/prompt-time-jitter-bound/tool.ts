import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedTimes: readonly number[];
  readonly observedTimes: readonly number[];
  readonly suppliedBound: number;
};
export type Output = {
  readonly maximumAbsoluteJitter: number;
  readonly exceedsBound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    observedTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedBound: { type: "number", minimum: 0 },
  },
  required: ["plannedTimes", "observedTimes", "suppliedBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumAbsoluteJitter: { type: "number" },
    exceedsBound: { type: "boolean" },
  },
  required: ["maximumAbsoluteJitter", "exceedsBound"],
} as const;
/** Calculate prompt time jitter bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedTimes, observedTimes, suppliedBound } = request;
  const compute = (): Output => {
    H.sameLength(plannedTimes, observedTimes);
    H.domain(suppliedBound >= 0);
    return (() => {
      const maximumAbsoluteJitter = Math.max(
        0,
        ...plannedTimes.map((x, i) => Math.abs(observedTimes[i] - x)),
      );
      return {
        maximumAbsoluteJitter,
        exceedsBound: maximumAbsoluteJitter > suppliedBound,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedTimes: [1, 2],
    observedTimes: [1.1, 1.8],
    suppliedBound: 0.15,
  },
  output: { maximumAbsoluteJitter: 0.19999999999999996, exceedsBound: true },
} satisfies ToolExample<Input, Output>;
export const promptTimeJitterBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/prompt-time-jitter-bound",
    title: "Prompt Time Jitter Bound Tool",
    description:
      "Calculate prompt time jitter bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        observedTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedBound: { type: "number", minimum: 0 },
      },
      required: ["plannedTimes", "observedTimes", "suppliedBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumAbsoluteJitter: { type: "number" },
        exceedsBound: { type: "boolean" },
      },
      required: ["maximumAbsoluteJitter", "exceedsBound"],
    },
    ports: {
      inputs: [
        {
          id: "plannedTimes",
          label: "Planned Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observedTimes",
          label: "Observed Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedBound",
          label: "Supplied Bound",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "maximumAbsoluteJitter",
          label: "Maximum Absolute Jitter",
          valueType: { type: "number" },
        },
        {
          id: "exceedsBound",
          label: "Exceeds Bound",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = promptTimeJitterBoundTool.execute;
export default promptTimeJitterBoundTool;
