import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leaveDays: readonly number[];
  readonly eligibleDays: readonly number[];
};
export type Output = {
  readonly leaveTotal: number;
  readonly eligibleTotal: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaveDays: { type: "array", maxItems: 256, items: { type: "number" } },
    eligibleDays: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["leaveDays", "eligibleDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leaveTotal: { type: "number" },
    eligibleTotal: { type: "number" },
    share: { type: "number" },
  },
  required: ["leaveTotal", "eligibleTotal", "share"],
} as const;
/** Calculate leave share person day denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leaveDays, eligibleDays } = request;
  const compute = (): Output => {
    H.sameLength(leaveDays, eligibleDays);
    H.domain(
      leaveDays.every((x, i) => x >= 0 && eligibleDays[i] >= x) &&
        eligibleDays.some((x) => x > 0),
    );
    return {
      leaveTotal: leaveDays.reduce((a, b) => a + b, 0),
      eligibleTotal: eligibleDays.reduce((a, b) => a + b, 0),
      share:
        leaveDays.reduce((a, b) => a + b, 0) /
        eligibleDays.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leaveDays: [5, 10], eligibleDays: [20, 20] },
  output: { leaveTotal: 15, eligibleTotal: 40, share: 0.375 },
} satisfies ToolExample<Input, Output>;
export const leaveSharePersonDayDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/leave-share-person-day-denominator",
    title: "Leave Share Person Day Denominator Tool",
    description:
      "Calculate leave share person day denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leaveDays: { type: "array", maxItems: 256, items: { type: "number" } },
        eligibleDays: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["leaveDays", "eligibleDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leaveTotal: { type: "number" },
        eligibleTotal: { type: "number" },
        share: { type: "number" },
      },
      required: ["leaveTotal", "eligibleTotal", "share"],
    },
    ports: {
      inputs: [
        {
          id: "leaveDays",
          label: "Leave Days",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eligibleDays",
          label: "Eligible Days",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "leaveTotal",
          label: "Leave Total",
          valueType: { type: "number" },
        },
        {
          id: "eligibleTotal",
          label: "Eligible Total",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = leaveSharePersonDayDenominatorTool.execute;
export default leaveSharePersonDayDenominatorTool;
