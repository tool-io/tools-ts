import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineArea: number;
  readonly followupArea: number;
};
export type Output = {
  readonly areaRatio: number;
  readonly signedAreaChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineArea: { type: "number", exclusiveMinimum: 0 },
    followupArea: { type: "number", minimum: 0 },
  },
  required: ["baselineArea", "followupArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaRatio: { type: "number" },
    signedAreaChange: { type: "number" },
  },
  required: ["areaRatio", "signedAreaChange"],
} as const;
/** Compare supplied follow-up and positive baseline lesion areas on a shared measurement basis without diagnostic or response criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineArea, followupArea } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(baselineArea) && baselineArea > 0,
      "baselineArea",
    ),
      baselineArea);
    H.domain(followupArea >= 0, "followupArea");
    return {
      areaRatio: followupArea / baselineArea,
      signedAreaChange: followupArea - baselineArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineArea: 20, followupArea: 30 },
  output: { areaRatio: 1.5, signedAreaChange: 10 },
} satisfies ToolExample<Input, Output>;
export const skinLesionFollowupAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-lesion-followup-area-ratio",
    title: "Skin Lesion Followup Area Ratio Tool",
    description:
      "Compare supplied follow-up and positive baseline lesion areas on a shared measurement basis without diagnostic or response criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineArea: { type: "number", exclusiveMinimum: 0 },
        followupArea: { type: "number", minimum: 0 },
      },
      required: ["baselineArea", "followupArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaRatio: { type: "number" },
        signedAreaChange: { type: "number" },
      },
      required: ["areaRatio", "signedAreaChange"],
    },
    ports: {
      inputs: [
        {
          id: "baselineArea",
          label: "Baseline Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "followupArea",
          label: "Followup Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaRatio", label: "Area Ratio", valueType: { type: "number" } },
        {
          id: "signedAreaChange",
          label: "Signed Area Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skinLesionFollowupAreaRatioTool.execute;
export default skinLesionFollowupAreaRatioTool;
