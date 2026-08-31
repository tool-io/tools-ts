import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../batch-shared.js";
export type Input = Readonly<{
  readonly captionShutterSeconds: number;
  readonly metadataShutterSeconds: number;
  readonly captionIso: number;
  readonly metadataIso: number;
  readonly shutterMetadataAvailable: boolean;
  readonly isoMetadataAvailable: boolean;
  readonly callerRelativeExposureToleranceFraction: number;
}>;
export type Output = Readonly<{
  readonly relativeShutterMismatchFraction: number;
  readonly relativeIsoMismatchFraction: number;
  readonly exposureMismatchFieldNames: readonly string[];
  readonly unavailableExposureFieldNames: readonly string[];
}>;
const inputFields = [
  {
    id: "captionShutterSeconds",
    label: "Caption shutter seconds",
    kind: "number",
  },
  {
    id: "metadataShutterSeconds",
    label: "Metadata shutter seconds",
    kind: "number",
  },
  { id: "captionIso", label: "Caption iso", kind: "number" },
  { id: "metadataIso", label: "Metadata iso", kind: "number" },
  {
    id: "shutterMetadataAvailable",
    label: "Shutter metadata available",
    kind: "boolean",
  },
  {
    id: "isoMetadataAvailable",
    label: "Iso metadata available",
    kind: "boolean",
  },
  {
    id: "callerRelativeExposureToleranceFraction",
    label: "Caller relative exposure tolerance fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.captionShutterSeconds, "captionShutterSeconds");
  positive(input.captionIso, "captionIso");
  fraction(
    input.callerRelativeExposureToleranceFraction,
    "callerRelativeExposureToleranceFraction",
  );
  if (input.shutterMetadataAvailable)
    positive(input.metadataShutterSeconds, "metadataShutter");
  else if (input.metadataShutterSeconds !== 0)
    simpleError("metadata", "Missing shutter evidence requires zero sentinel.");
  if (input.isoMetadataAvailable) positive(input.metadataIso, "metadataIso");
  else if (input.metadataIso !== 0)
    simpleError("metadata", "Missing ISO evidence requires zero sentinel.");
  const shutter = input.shutterMetadataAvailable
      ? Math.abs(input.captionShutterSeconds - input.metadataShutterSeconds) /
        input.metadataShutterSeconds
      : -1,
    iso = input.isoMetadataAvailable
      ? Math.abs(input.captionIso - input.metadataIso) / input.metadataIso
      : -1,
    mismatch: string[] = [],
    missing: string[] = [];
  if (!input.shutterMetadataAvailable) missing.push("shutterSeconds");
  else if (shutter > input.callerRelativeExposureToleranceFraction)
    mismatch.push("shutterSeconds");
  if (!input.isoMetadataAvailable) missing.push("iso");
  else if (iso > input.callerRelativeExposureToleranceFraction)
    mismatch.push("iso");
  return {
    relativeShutterMismatchFraction: shutter,
    relativeIsoMismatchFraction: iso,
    exposureMismatchFieldNames: mismatch,
    unavailableExposureFieldNames: missing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  captionShutterSeconds: 0.01,
  metadataShutterSeconds: 0.02,
  captionIso: 100,
  metadataIso: 100,
  shutterMetadataAvailable: true,
  isoMetadataAvailable: true,
  callerRelativeExposureToleranceFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  relativeShutterMismatchFraction: 0.5,
  relativeIsoMismatchFraction: 0,
  exposureMismatchFieldNames: ["shutterSeconds"],
  unavailableExposureFieldNames: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/photo-caption-exif-shutter-iso-verify-checker",
  title: "Photo Caption Exif Shutter Iso Verify Checker",
  description:
    "Compare actual caller caption shutter/ISO values with separately decoded photo metadata under explicit relative tolerance and missing evidence; unlike metadata-key coverage this checks values, not EXIF authenticity, image manipulation or raw file parsing.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeShutterMismatchFraction",
      label: "Relative shutter mismatch fraction",
      kind: "number",
    },
    {
      id: "relativeIsoMismatchFraction",
      label: "Relative iso mismatch fraction",
      kind: "number",
    },
    {
      id: "exposureMismatchFieldNames",
      label: "Exposure mismatch field names",
      kind: "stringList",
    },
    {
      id: "unavailableExposureFieldNames",
      label: "Unavailable exposure field names",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      captionShutterSeconds: value.captionShutterSeconds as number,
      metadataShutterSeconds: value.metadataShutterSeconds as number,
      captionIso: value.captionIso as number,
      metadataIso: value.metadataIso as number,
      shutterMetadataAvailable: value.shutterMetadataAvailable as boolean,
      isoMetadataAvailable: value.isoMetadataAvailable as boolean,
      callerRelativeExposureToleranceFraction:
        value.callerRelativeExposureToleranceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
