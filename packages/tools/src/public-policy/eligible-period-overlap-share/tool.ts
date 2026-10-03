import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleStart: number;
  readonly eligibleEnd: number;
  readonly periodStart: number;
  readonly periodEnd: number;
};
export type Output = { readonly overlap: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleStart: { type: "number" },
    eligibleEnd: { type: "number" },
    periodStart: { type: "number" },
    periodEnd: { type: "number" },
  },
  required: ["eligibleStart", "eligibleEnd", "periodStart", "periodEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, share: { type: "number" } },
  required: ["overlap", "share"],
} as const;
/** Calculate eligible period overlap share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleStart, eligibleEnd, periodStart, periodEnd } = request;
  const compute = (): Output => {
    H.domain(eligibleEnd >= eligibleStart && periodEnd > periodStart);
    return {
      overlap: Math.max(
        0,
        Math.min(eligibleEnd, periodEnd) - Math.max(eligibleStart, periodStart),
      ),
      share:
        Math.max(
          0,
          Math.min(eligibleEnd, periodEnd) -
            Math.max(eligibleStart, periodStart),
        ) /
        (periodEnd - periodStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleStart: 5, eligibleEnd: 15, periodStart: 0, periodEnd: 10 },
  output: { overlap: 5, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const eligiblePeriodOverlapShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/eligible-period-overlap-share",
    title: "Eligible Period Overlap Share Tool",
    description:
      "Calculate eligible period overlap share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleStart: { type: "number" },
        eligibleEnd: { type: "number" },
        periodStart: { type: "number" },
        periodEnd: { type: "number" },
      },
      required: ["eligibleStart", "eligibleEnd", "periodStart", "periodEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "number" }, share: { type: "number" } },
      required: ["overlap", "share"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleStart",
          label: "Eligible Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleEnd",
          label: "Eligible End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodStart",
          label: "Period Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodEnd",
          label: "Period End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eligiblePeriodOverlapShareTool.execute;
export default eligiblePeriodOverlapShareTool;
