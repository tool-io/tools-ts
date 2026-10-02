import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenVolume: number;
  readonly fixativeVolume: number;
  readonly previouslyDisplacedVolume: number;
};
export type Output = {
  readonly availableFluid: number;
  readonly fluidSpecimenRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenVolume: { type: "number", exclusiveMinimum: 0 },
    fixativeVolume: { type: "number" },
    previouslyDisplacedVolume: { type: "number", minimum: 0 },
  },
  required: ["specimenVolume", "fixativeVolume", "previouslyDisplacedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableFluid: { type: "number" },
    fluidSpecimenRatio: { type: "number" },
  },
  required: ["availableFluid", "fluidSpecimenRatio"],
} as const;
/** Recorded fluid-to-specimen volume ratio only, without specifying a fixative, exposure duration or adequacy threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenVolume, fixativeVolume, previouslyDisplacedVolume } = request;
  const compute = (): Output => {
    H.positive(specimenVolume);
    H.domain(
      previouslyDisplacedVolume >= 0 &&
        fixativeVolume >= previouslyDisplacedVolume,
    );
    return {
      availableFluid: fixativeVolume - previouslyDisplacedVolume,
      fluidSpecimenRatio:
        (fixativeVolume - previouslyDisplacedVolume) / specimenVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenVolume: 10,
    fixativeVolume: 100,
    previouslyDisplacedVolume: 20,
  },
  output: { availableFluid: 80, fluidSpecimenRatio: 8 },
} satisfies ToolExample<Input, Output>;
export const specimenFixationVolumeRatioRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/specimen-fixation-volume-ratio-record",
    title: "Specimen Fixation Volume Ratio Record Tool",
    description:
      "Recorded fluid-to-specimen volume ratio only, without specifying a fixative, exposure duration or adequacy threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenVolume: { type: "number", exclusiveMinimum: 0 },
        fixativeVolume: { type: "number" },
        previouslyDisplacedVolume: { type: "number", minimum: 0 },
      },
      required: [
        "specimenVolume",
        "fixativeVolume",
        "previouslyDisplacedVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableFluid: { type: "number" },
        fluidSpecimenRatio: { type: "number" },
      },
      required: ["availableFluid", "fluidSpecimenRatio"],
    },
    ports: {
      inputs: [
        {
          id: "specimenVolume",
          label: "Specimen Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixativeVolume",
          label: "Fixative Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previouslyDisplacedVolume",
          label: "Previously Displaced Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableFluid",
          label: "Available Fluid",
          valueType: { type: "number" },
        },
        {
          id: "fluidSpecimenRatio",
          label: "Fluid Specimen Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specimenFixationVolumeRatioRecordTool.execute;
export default specimenFixationVolumeRatioRecordTool;
