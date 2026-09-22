import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly nullBranches: readonly boolean[];
};
export type Output = {
  readonly nullMass: number;
  readonly nonnullMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    nullBranches: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["probabilities", "nullBranches"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nullMass: { type: "number" }, nonnullMass: { type: "number" } },
  required: ["nullMass", "nonnullMass"],
} as const;
/** Calculate lottery null branch mass from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, nullBranches } = request;
  const compute = (): Output => {
    H.sameLength(probabilities, nullBranches);
    H.domain(
      probabilities.every((x) => x >= 0 && x <= 1) &&
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      nullMass: probabilities.reduce(
        (s, x, i) => s + (nullBranches[i] ? x : 0),
        0,
      ),
      nonnullMass: probabilities.reduce(
        (s, x, i) => s + (nullBranches[i] ? 0 : x),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.2, 0.3, 0.5], nullBranches: [true, false, true] },
  output: { nullMass: 0.7, nonnullMass: 0.3 },
} satisfies ToolExample<Input, Output>;
export const lotteryNullBranchMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/lottery-null-branch-mass",
    title: "Lottery Null Branch Mass Tool",
    description:
      "Calculate lottery null branch mass from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        nullBranches: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["probabilities", "nullBranches"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nullMass: { type: "number" },
        nonnullMass: { type: "number" },
      },
      required: ["nullMass", "nonnullMass"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "nullBranches",
          label: "Null Branches",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "nullMass", label: "Null Mass", valueType: { type: "number" } },
        {
          id: "nonnullMass",
          label: "Nonnull Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lotteryNullBranchMassTool.execute;
export default lotteryNullBranchMassTool;
