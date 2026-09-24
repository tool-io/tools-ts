import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hours: number;
  readonly suppliedHourlyValue: number;
  readonly cashMatch: number;
  readonly requiredMatch: number;
  readonly inKindCap: number;
};
export type Output = {
  readonly recognizedInKind: number;
  readonly recognizedTotal: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hours: { type: "number", minimum: 0 },
    suppliedHourlyValue: { type: "number", minimum: 0 },
    cashMatch: { type: "number", minimum: 0 },
    requiredMatch: { type: "number", minimum: 0 },
    inKindCap: { type: "number", minimum: 0 },
  },
  required: [
    "hours",
    "suppliedHourlyValue",
    "cashMatch",
    "requiredMatch",
    "inKindCap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedInKind: { type: "number" },
    recognizedTotal: { type: "number" },
    gap: { type: "number" },
  },
  required: ["recognizedInKind", "recognizedTotal", "gap"],
} as const;
/** Calculate volunteer in kind match cap gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hours, suppliedHourlyValue, cashMatch, requiredMatch, inKindCap } =
    request;
  const compute = (): Output => {
    H.domain(
      hours >= 0 &&
        suppliedHourlyValue >= 0 &&
        cashMatch >= 0 &&
        requiredMatch >= 0 &&
        inKindCap >= 0,
    );
    return {
      recognizedInKind: Math.min(hours * suppliedHourlyValue, inKindCap),
      recognizedTotal:
        cashMatch + Math.min(hours * suppliedHourlyValue, inKindCap),
      gap:
        cashMatch +
        Math.min(hours * suppliedHourlyValue, inKindCap) -
        requiredMatch,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hours: 10,
    suppliedHourlyValue: 20,
    cashMatch: 50,
    requiredMatch: 300,
    inKindCap: 200,
  },
  output: { recognizedInKind: 200, recognizedTotal: 250, gap: -50 },
} satisfies ToolExample<Input, Output>;
export const volunteerInKindMatchCapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/volunteer-in-kind-match-cap-gap",
    title: "Volunteer In Kind Match Cap Gap Tool",
    description:
      "Calculate volunteer in kind match cap gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hours: { type: "number", minimum: 0 },
        suppliedHourlyValue: { type: "number", minimum: 0 },
        cashMatch: { type: "number", minimum: 0 },
        requiredMatch: { type: "number", minimum: 0 },
        inKindCap: { type: "number", minimum: 0 },
      },
      required: [
        "hours",
        "suppliedHourlyValue",
        "cashMatch",
        "requiredMatch",
        "inKindCap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognizedInKind: { type: "number" },
        recognizedTotal: { type: "number" },
        gap: { type: "number" },
      },
      required: ["recognizedInKind", "recognizedTotal", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHourlyValue",
          label: "Supplied Hourly Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashMatch",
          label: "Cash Match",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredMatch",
          label: "Required Match",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inKindCap",
          label: "In Kind Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recognizedInKind",
          label: "Recognized In Kind",
          valueType: { type: "number" },
        },
        {
          id: "recognizedTotal",
          label: "Recognized Total",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = volunteerInKindMatchCapGapTool.execute;
export default volunteerInKindMatchCapGapTool;
