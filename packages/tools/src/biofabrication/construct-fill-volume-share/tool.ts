import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly filledVolume: number;
  readonly grossVolume: number;
  readonly excludedVolume: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominatorVolume: number;
  readonly fillShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filledVolume: { type: "number", minimum: 0 },
    grossVolume: { type: "number" },
    excludedVolume: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["filledVolume", "grossVolume", "excludedVolume", "excludeMarked"],
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
/** Supplied geometric fill-volume accounting without construct biology or fabrication guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filledVolume, grossVolume, excludedVolume, excludeMarked } = request;
  const compute = (): Output => {
    H.domain(
      grossVolume > excludedVolume &&
        excludedVolume >= 0 &&
        filledVolume >= 0 &&
        filledVolume <= grossVolume - excludedVolume,
    );
    return {
      denominatorVolume: grossVolume - (excludeMarked ? excludedVolume : 0),
      fillShare:
        filledVolume / (grossVolume - (excludeMarked ? excludedVolume : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    filledVolume: 20,
    grossVolume: 100,
    excludedVolume: 20,
    excludeMarked: true,
  },
  output: { denominatorVolume: 80, fillShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const constructFillVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/construct-fill-volume-share",
    title: "Construct Fill Volume Share Tool",
    description:
      "Supplied geometric fill-volume accounting without construct biology or fabrication guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filledVolume: { type: "number", minimum: 0 },
        grossVolume: { type: "number" },
        excludedVolume: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: [
        "filledVolume",
        "grossVolume",
        "excludedVolume",
        "excludeMarked",
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
          id: "filledVolume",
          label: "Filled Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossVolume",
          label: "Gross Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
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
export const run = constructFillVolumeShareTool.execute;
export default constructFillVolumeShareTool;
