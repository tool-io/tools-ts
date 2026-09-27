import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delegatedStart: number;
  readonly delegatedEnd: number;
  readonly activityStart: number;
  readonly activityEnd: number;
};
export type Output = { readonly overlap: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delegatedStart: { type: "number" },
    delegatedEnd: { type: "number" },
    activityStart: { type: "number" },
    activityEnd: { type: "number" },
  },
  required: ["delegatedStart", "delegatedEnd", "activityStart", "activityEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, share: { type: "number" } },
  required: ["overlap", "share"],
} as const;
/** Measure supplied delegation-record overlap without assessing authority or GCP compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delegatedStart, delegatedEnd, activityStart, activityEnd } = request;
  const compute = (): Output => {
    H.domain(delegatedEnd >= delegatedStart && activityEnd > activityStart);
    return {
      overlap: Math.max(
        0,
        Math.min(delegatedEnd, activityEnd) -
          Math.max(delegatedStart, activityStart),
      ),
      share:
        Math.max(
          0,
          Math.min(delegatedEnd, activityEnd) -
            Math.max(delegatedStart, activityStart),
        ) /
        (activityEnd - activityStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    delegatedStart: 10,
    delegatedEnd: 20,
    activityStart: 15,
    activityEnd: 25,
  },
  output: { overlap: 5, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const delegationPeriodOverlapShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/delegation-period-overlap-share",
    title: "Delegation Period Overlap Share Tool",
    description:
      "Measure supplied delegation-record overlap without assessing authority or GCP compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delegatedStart: { type: "number" },
        delegatedEnd: { type: "number" },
        activityStart: { type: "number" },
        activityEnd: { type: "number" },
      },
      required: [
        "delegatedStart",
        "delegatedEnd",
        "activityStart",
        "activityEnd",
      ],
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
          id: "delegatedStart",
          label: "Delegated Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delegatedEnd",
          label: "Delegated End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activityStart",
          label: "Activity Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activityEnd",
          label: "Activity End",
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
export const run = delegationPeriodOverlapShareTool.execute;
export default delegationPeriodOverlapShareTool;
