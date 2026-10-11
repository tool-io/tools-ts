import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedChildren: number;
  readonly recordedAdults: number;
};
export type Output = {
  readonly groupCount: number;
  readonly childShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedChildren: { type: "integer", minimum: 0 },
    recordedAdults: { type: "integer", minimum: 0 },
  },
  required: ["recordedChildren", "recordedAdults"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupCount: { type: "integer" },
    childShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["groupCount", "childShare", "defined"],
} as const;
/** Reconcile explicit child and adult group counts, using a flagged zero share for an empty group without defining age categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedChildren, recordedAdults } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedChildren) &&
        recordedChildren >= 0 &&
        recordedChildren <= Number.MAX_SAFE_INTEGER,
      "recordedChildren",
    ),
      recordedChildren);
    (H.domain(
      Number.isSafeInteger(recordedAdults) &&
        recordedAdults >= 0 &&
        recordedAdults <= Number.MAX_SAFE_INTEGER,
      "recordedAdults",
    ),
      recordedAdults);
    return (() => {
      const groupCount = Number(
        BigInt(recordedChildren) + BigInt(recordedAdults),
      );
      return {
        groupCount,
        childShare: groupCount > 0 ? recordedChildren / groupCount : 0,
        defined: groupCount > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedChildren: 5, recordedAdults: 15 },
  output: { groupCount: 20, childShare: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const tourGroupChildAdultCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/tour-group-child-adult-count",
    title: "Tour Group Child Adult Count",
    description:
      "Reconcile explicit child and adult group counts, using a flagged zero share for an empty group without defining age categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedChildren: { type: "integer", minimum: 0 },
        recordedAdults: { type: "integer", minimum: 0 },
      },
      required: ["recordedChildren", "recordedAdults"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupCount: { type: "integer" },
        childShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["groupCount", "childShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "recordedChildren",
          label: "Recorded Children",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedAdults",
          label: "Recorded Adults",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "groupCount",
          label: "Group Count",
          valueType: { type: "integer" },
        },
        {
          id: "childShare",
          label: "Child Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tourGroupChildAdultCountTool.execute;
export default tourGroupChildAdultCountTool;
