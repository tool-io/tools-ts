import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  lookup,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerHolderIds: readonly string[];
  readonly callerOuterDiametersMm: readonly number[];
  readonly callerMaximumImageDiametersMm: readonly number[];
  readonly requestedHolderId: string;
  readonly observedGoboOuterDiameterMm: number;
  readonly observedImageDiameterMm: number;
  readonly callerFitToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly callerVerifiedOuterDiameterMm: number;
  readonly callerVerifiedImageMaximumMm: number;
  readonly outerDiameterWithinCallerFitTolerance: boolean;
  readonly imageWithinCallerAperture: boolean;
}>;
const inputFields = [
  { id: "callerHolderIds", label: "Caller holder ids", kind: "stringList" },
  {
    id: "callerOuterDiametersMm",
    label: "Caller outer diameters mm",
    kind: "numberList",
  },
  {
    id: "callerMaximumImageDiametersMm",
    label: "Caller maximum image diameters mm",
    kind: "numberList",
  },
  { id: "requestedHolderId", label: "Requested holder id", kind: "string" },
  {
    id: "observedGoboOuterDiameterMm",
    label: "Observed gobo outer diameter mm",
    kind: "number",
  },
  {
    id: "observedImageDiameterMm",
    label: "Observed image diameter mm",
    kind: "number",
  },
  {
    id: "callerFitToleranceMm",
    label: "Caller fit tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerOuterDiametersMm.forEach((v) =>
    positive(v, "callerOuterDiametersMm"),
  );
  input.callerMaximumImageDiametersMm.forEach((v) =>
    positive(v, "callerMaximumImageDiametersMm"),
  );
  positive(input.observedGoboOuterDiameterMm, "observedGoboOuterDiameterMm");
  nonnegative(input.observedImageDiameterMm, "observedImageDiameterMm");
  nonnegative(input.callerFitToleranceMm, "callerFitToleranceMm");
  aligned(
    input.callerHolderIds,
    input.callerOuterDiametersMm,
    "callerHolderIds",
  );
  aligned(
    input.callerHolderIds,
    input.callerMaximumImageDiametersMm,
    "callerHolderIds",
  );
  const outer = lookup(
      input.callerHolderIds,
      input.callerOuterDiametersMm,
      input.requestedHolderId,
    ),
    image = lookup(
      input.callerHolderIds,
      input.callerMaximumImageDiametersMm,
      input.requestedHolderId,
    );
  if (image > outer)
    simpleError(
      "catalog",
      "Image diameter cannot exceed holder outer diameter.",
    );
  return {
    callerVerifiedOuterDiameterMm: outer,
    callerVerifiedImageMaximumMm: image,
    outerDiameterWithinCallerFitTolerance:
      Math.abs(input.observedGoboOuterDiameterMm - outer) <=
      input.callerFitToleranceMm,
    imageWithinCallerAperture: input.observedImageDiameterMm <= image,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHolderIds: ["A", "B"],
  callerOuterDiametersMm: [100, 86],
  callerMaximumImageDiametersMm: [75, 64],
  requestedHolderId: "B",
  observedGoboOuterDiameterMm: 86,
  observedImageDiameterMm: 60,
  callerFitToleranceMm: 0.1,
} satisfies Input;
export const exampleOutput = {
  callerVerifiedOuterDiameterMm: 86,
  callerVerifiedImageMaximumMm: 64,
  outerDiameterWithinCallerFitTolerance: true,
  imageWithinCallerAperture: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/gobo-pattern-size-a-size-b-lookup",
  title: "Gobo Pattern Size A Size B Lookup",
  description:
    "Audit measured gobo size/image aperture against exact caller holder catalogue; no universal A/B diameters, thickness/thermal fit, fixture compatibility or safe operation guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerVerifiedOuterDiameterMm",
      label: "Caller verified outer diameter mm",
      kind: "number",
    },
    {
      id: "callerVerifiedImageMaximumMm",
      label: "Caller verified image maximum mm",
      kind: "number",
    },
    {
      id: "outerDiameterWithinCallerFitTolerance",
      label: "Outer diameter within caller fit tolerance",
      kind: "boolean",
    },
    {
      id: "imageWithinCallerAperture",
      label: "Image within caller aperture",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHolderIds: value.callerHolderIds as readonly string[],
      callerOuterDiametersMm: value.callerOuterDiametersMm as readonly number[],
      callerMaximumImageDiametersMm:
        value.callerMaximumImageDiametersMm as readonly number[],
      requestedHolderId: value.requestedHolderId as string,
      observedGoboOuterDiameterMm: value.observedGoboOuterDiameterMm as number,
      observedImageDiameterMm: value.observedImageDiameterMm as number,
      callerFitToleranceMm: value.callerFitToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
