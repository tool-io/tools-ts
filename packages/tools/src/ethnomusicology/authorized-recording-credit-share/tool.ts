import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditedDurations: readonly number[];
  readonly authorized: readonly boolean[];
  readonly totalRecordingDuration: number;
};
export type Output = {
  readonly creditedDuration: number;
  readonly authorizedCreditDuration: number;
  readonly authorizedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    authorized: { type: "array", maxItems: 256, items: { type: "boolean" } },
    totalRecordingDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["creditedDurations", "authorized", "totalRecordingDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedDuration: { type: "number" },
    authorizedCreditDuration: { type: "number" },
    authorizedShare: { type: "number" },
  },
  required: ["creditedDuration", "authorizedCreditDuration", "authorizedShare"],
} as const;
/** Account for explicitly authorized recording credits; no copyright or community permission is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditedDurations, authorized, totalRecordingDuration } = request;
  const compute = (): Output => {
    H.sameLength(creditedDurations, authorized);
    H.domain(creditedDurations.every((x) => x >= 0));
    H.positive(totalRecordingDuration);
    return (() => {
      const creditedDuration = creditedDurations.reduce((a, b) => a + b, 0),
        authorizedCreditDuration = creditedDurations.reduce(
          (s, x, i) => s + (authorized[i] ? x : 0),
          0,
        );
      H.domain(creditedDuration <= totalRecordingDuration);
      return {
        creditedDuration,
        authorizedCreditDuration,
        authorizedShare: authorizedCreditDuration / totalRecordingDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    creditedDurations: [2, 3],
    authorized: [true, false],
    totalRecordingDuration: 10,
  },
  output: {
    creditedDuration: 5,
    authorizedCreditDuration: 2,
    authorizedShare: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const authorizedRecordingCreditShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/authorized-recording-credit-share",
    title: "Authorized Recording Credit Share Tool",
    description:
      "Account for explicitly authorized recording credits; no copyright or community permission is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        authorized: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        totalRecordingDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["creditedDurations", "authorized", "totalRecordingDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedDuration: { type: "number" },
        authorizedCreditDuration: { type: "number" },
        authorizedShare: { type: "number" },
      },
      required: [
        "creditedDuration",
        "authorizedCreditDuration",
        "authorizedShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "creditedDurations",
          label: "Credited Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "authorized",
          label: "Authorized",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "totalRecordingDuration",
          label: "Total Recording Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedDuration",
          label: "Credited Duration",
          valueType: { type: "number" },
        },
        {
          id: "authorizedCreditDuration",
          label: "Authorized Credit Duration",
          valueType: { type: "number" },
        },
        {
          id: "authorizedShare",
          label: "Authorized Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedRecordingCreditShareTool.execute;
export default authorizedRecordingCreditShareTool;
