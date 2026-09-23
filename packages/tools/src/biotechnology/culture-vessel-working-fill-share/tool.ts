import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workingVolume: number;
  readonly nominalVolume: number;
  readonly excludedDeadVolume: number;
  readonly excludeDead: boolean;
};
export type Output = {
  readonly denominatorVolume: number;
  readonly fillShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workingVolume: { type: "number", minimum: 0 },
    nominalVolume: { type: "number", exclusiveMinimum: 0 },
    excludedDeadVolume: { type: "number", minimum: 0 },
    excludeDead: { type: "boolean" },
  },
  required: [
    "workingVolume",
    "nominalVolume",
    "excludedDeadVolume",
    "excludeDead",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorVolume: { type: "number" },
    fillShare: { type: "number" },
  },
  required: ["denominatorVolume", "fillShare"],
} as const;
/** Supplied vessel-volume accounting only, without organism-specific fill or growth recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workingVolume, nominalVolume, excludedDeadVolume, excludeDead } =
    request;
  const compute = (): Output => {
    H.positive(nominalVolume);
    H.domain(
      workingVolume >= 0 &&
        excludedDeadVolume >= 0 &&
        excludedDeadVolume < nominalVolume,
    );
    return {
      denominatorVolume: nominalVolume - (excludeDead ? excludedDeadVolume : 0),
      fillShare:
        workingVolume /
        (nominalVolume - (excludeDead ? excludedDeadVolume : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workingVolume: 60,
    nominalVolume: 100,
    excludedDeadVolume: 20,
    excludeDead: true,
  },
  output: { denominatorVolume: 80, fillShare: 0.75 },
} satisfies ToolExample<Input, Output>;
export const cultureVesselWorkingFillShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/culture-vessel-working-fill-share",
    title: "Culture Vessel Working Fill Share Tool",
    description:
      "Supplied vessel-volume accounting only, without organism-specific fill or growth recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workingVolume: { type: "number", minimum: 0 },
        nominalVolume: { type: "number", exclusiveMinimum: 0 },
        excludedDeadVolume: { type: "number", minimum: 0 },
        excludeDead: { type: "boolean" },
      },
      required: [
        "workingVolume",
        "nominalVolume",
        "excludedDeadVolume",
        "excludeDead",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorVolume: { type: "number" },
        fillShare: { type: "number" },
      },
      required: ["denominatorVolume", "fillShare"],
    },
    ports: {
      inputs: [
        {
          id: "workingVolume",
          label: "Working Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalVolume",
          label: "Nominal Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDeadVolume",
          label: "Excluded Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeDead",
          label: "Exclude Dead",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorVolume",
          label: "Denominator Volume",
          valueType: { type: "number" },
        },
        { id: "fillShare", label: "Fill Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cultureVesselWorkingFillShareTool.execute;
export default cultureVesselWorkingFillShareTool;
