import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTimes: readonly number[];
  readonly selected: readonly boolean[];
  readonly requiredPoints: number;
};
export type Output = {
  readonly distinctSelectedPoints: number;
  readonly shortfall: number;
  readonly duplicateSelectedPoints: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requiredPoints: { type: "integer", minimum: 1 },
  },
  required: ["sampleTimes", "selected", "requiredPoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctSelectedPoints: { type: "integer" },
    shortfall: { type: "integer" },
    duplicateSelectedPoints: { type: "integer" },
  },
  required: ["distinctSelectedPoints", "shortfall", "duplicateSelectedPoints"],
} as const;
/** Audit distinct supplied terminal-window timestamps against a supplied minimum; does not fit elimination or validate a terminal phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTimes, selected, requiredPoints } = request;
  const compute = (): Output => {
    H.sameLength(sampleTimes, selected);
    H.integer(requiredPoints, 1);
    const chosen = sampleTimes.filter((_, i) => selected[i]),
      n = new Set(chosen).size;
    return {
      distinctSelectedPoints: n,
      shortfall: Math.max(0, requiredPoints - n),
      duplicateSelectedPoints: chosen.length - n,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleTimes: [1, 2, 2, 3],
    selected: [true, true, true, false],
    requiredPoints: 3,
  },
  output: {
    distinctSelectedPoints: 2,
    shortfall: 1,
    duplicateSelectedPoints: 1,
  },
} satisfies ToolExample<Input, Output>;
export const pkTerminalWindowMinPointBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-terminal-window-min-point-budget",
    title: "PK Terminal Window Min Point Budget Tool",
    description:
      "Audit distinct supplied terminal-window timestamps against a supplied minimum; does not fit elimination or validate a terminal phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requiredPoints: { type: "integer", minimum: 1 },
      },
      required: ["sampleTimes", "selected", "requiredPoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctSelectedPoints: { type: "integer" },
        shortfall: { type: "integer" },
        duplicateSelectedPoints: { type: "integer" },
      },
      required: [
        "distinctSelectedPoints",
        "shortfall",
        "duplicateSelectedPoints",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sampleTimes",
          label: "Sample Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredPoints",
          label: "Required Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distinctSelectedPoints",
          label: "Distinct Selected Points",
          valueType: { type: "integer" },
        },
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        {
          id: "duplicateSelectedPoints",
          label: "Duplicate Selected Points",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkTerminalWindowMinPointBudgetTool.execute;
export default pkTerminalWindowMinPointBudgetTool;
