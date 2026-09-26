import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawMark: number;
  readonly periods: number;
  readonly penaltyPerPeriod: number;
  readonly cap: number;
};
export type Output = { readonly deduction: number; readonly finalMark: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMark: { type: "number", minimum: 0 },
    periods: { type: "integer", minimum: 0 },
    penaltyPerPeriod: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["rawMark", "periods", "penaltyPerPeriod", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deduction: { type: "number" }, finalMark: { type: "number" } },
  required: ["deduction", "finalMark"],
} as const;
/** Calculate assignment late penalty explicit cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawMark, periods, penaltyPerPeriod, cap } = request;
  const compute = (): Output => {
    H.domain(rawMark >= 0 && penaltyPerPeriod >= 0 && cap >= 0);
    H.integer(periods, 0);
    return {
      deduction: Math.min(rawMark, cap, periods * penaltyPerPeriod),
      finalMark: rawMark - Math.min(rawMark, cap, periods * penaltyPerPeriod),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawMark: 80, periods: 3, penaltyPerPeriod: 5, cap: 10 },
  output: { deduction: 10, finalMark: 70 },
} satisfies ToolExample<Input, Output>;
export const assignmentLatePenaltyExplicitCapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assignment-late-penalty-explicit-cap",
    title: "Assignment Late Penalty Explicit Cap Tool",
    description:
      "Calculate assignment late penalty explicit cap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawMark: { type: "number", minimum: 0 },
        periods: { type: "integer", minimum: 0 },
        penaltyPerPeriod: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
      },
      required: ["rawMark", "periods", "penaltyPerPeriod", "cap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deduction: { type: "number" },
        finalMark: { type: "number" },
      },
      required: ["deduction", "finalMark"],
    },
    ports: {
      inputs: [
        {
          id: "rawMark",
          label: "Raw Mark",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periods",
          label: "Periods",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "penaltyPerPeriod",
          label: "Penalty Per Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deduction", label: "Deduction", valueType: { type: "number" } },
        { id: "finalMark", label: "Final Mark", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assignmentLatePenaltyExplicitCapTool.execute;
export default assignmentLatePenaltyExplicitCapTool;
