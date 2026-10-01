import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startYear: number;
  readonly endYear: number;
  readonly referenceStart: number;
  readonly referenceEnd: number;
};
export type Output = {
  readonly overlapYears: number;
  readonly referenceYears: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startYear: { type: "integer" },
    endYear: { type: "integer" },
    referenceStart: { type: "integer" },
    referenceEnd: { type: "integer" },
  },
  required: ["startYear", "endYear", "referenceStart", "referenceEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapYears: { type: "integer" },
    referenceYears: { type: "integer" },
    share: { type: "number" },
  },
  required: ["overlapYears", "referenceYears", "share"],
} as const;
/** Compare half-open public historical year intervals; no unit facts or operational data are embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startYear, endYear, referenceStart, referenceEnd } = request;
  const compute = (): Output => {
    H.domain(endYear >= startYear && referenceEnd > referenceStart);
    return (() => {
      const overlapYears = Math.max(
          0,
          Math.min(endYear, referenceEnd) - Math.max(startYear, referenceStart),
        ),
        referenceYears = referenceEnd - referenceStart;
      return {
        overlapYears,
        referenceYears,
        share: overlapYears / referenceYears,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startYear: 1900,
    endYear: 1920,
    referenceStart: 1910,
    referenceEnd: 1950,
  },
  output: { overlapYears: 10, referenceYears: 40, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const historicPublicUnitTenureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/historic-public-unit-tenure-share",
    title: "Historic Public Unit Tenure Share Tool",
    description:
      "Compare half-open public historical year intervals; no unit facts or operational data are embedded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startYear: { type: "integer" },
        endYear: { type: "integer" },
        referenceStart: { type: "integer" },
        referenceEnd: { type: "integer" },
      },
      required: ["startYear", "endYear", "referenceStart", "referenceEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapYears: { type: "integer" },
        referenceYears: { type: "integer" },
        share: { type: "number" },
      },
      required: ["overlapYears", "referenceYears", "share"],
    },
    ports: {
      inputs: [
        {
          id: "startYear",
          label: "Start Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endYear",
          label: "End Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceStart",
          label: "Reference Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceEnd",
          label: "Reference End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapYears",
          label: "Overlap Years",
          valueType: { type: "integer" },
        },
        {
          id: "referenceYears",
          label: "Reference Years",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = historicPublicUnitTenureShareTool.execute;
export default historicPublicUnitTenureShareTool;
