import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyUid: string;
  readonly seriesUid: string;
  readonly sopUid: string;
  readonly parentStudyUid: string;
  readonly parentSeriesUid: string;
};
export type Output = {
  readonly hierarchyMatches: boolean;
  readonly instanceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyUid: { type: "string", maxLength: 8192 },
    seriesUid: { type: "string", maxLength: 8192 },
    sopUid: { type: "string", maxLength: 8192 },
    parentStudyUid: { type: "string", maxLength: 8192 },
    parentSeriesUid: { type: "string", maxLength: 8192 },
  },
  required: [
    "studyUid",
    "seriesUid",
    "sopUid",
    "parentStudyUid",
    "parentSeriesUid",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hierarchyMatches: { type: "boolean" },
    instanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["hierarchyMatches", "instanceKey"],
} as const;
/** Compare explicit study/series parent references and construct a scoped instance key from an ASCII numeric UID subset, without resolving DICOM objects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyUid, seriesUid, sopUid, parentStudyUid, parentSeriesUid } =
    request;
  const compute = (): Output => {
    const valid = (x: string) =>
      x.length > 0 &&
      x.length <= 64 &&
      /^(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*))*(?![\s\S])/.test(x);
    H.domain(
      [studyUid, seriesUid, sopUid, parentStudyUid, parentSeriesUid].every(
        valid,
      ),
    );
    return {
      hierarchyMatches:
        studyUid === parentStudyUid && seriesUid === parentSeriesUid,
      instanceKey: JSON.stringify([studyUid, seriesUid, sopUid]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyUid: "1.2.3",
    seriesUid: "1.2.4",
    sopUid: "1.2.5",
    parentStudyUid: "1.2.3",
    parentSeriesUid: "1.2.4",
  },
  output: { hierarchyMatches: true, instanceKey: '["1.2.3","1.2.4","1.2.5"]' },
} satisfies ToolExample<Input, Output>;
export const dicomStudySeriesSopReferencePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-study-series-sop-reference-pair",
    title: "DICOM Study Series SOP Reference Pair Tool",
    description:
      "Compare explicit study/series parent references and construct a scoped instance key from an ASCII numeric UID subset, without resolving DICOM objects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyUid: { type: "string", maxLength: 8192 },
        seriesUid: { type: "string", maxLength: 8192 },
        sopUid: { type: "string", maxLength: 8192 },
        parentStudyUid: { type: "string", maxLength: 8192 },
        parentSeriesUid: { type: "string", maxLength: 8192 },
      },
      required: [
        "studyUid",
        "seriesUid",
        "sopUid",
        "parentStudyUid",
        "parentSeriesUid",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hierarchyMatches: { type: "boolean" },
        instanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["hierarchyMatches", "instanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "studyUid",
          label: "Study Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriesUid",
          label: "Series Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sopUid",
          label: "Sop Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentStudyUid",
          label: "Parent Study Uid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentSeriesUid",
          label: "Parent Series Uid",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hierarchyMatches",
          label: "Hierarchy Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "instanceKey",
          label: "Instance Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomStudySeriesSopReferencePairTool.execute;
export default dicomStudySeriesSopReferencePairTool;
