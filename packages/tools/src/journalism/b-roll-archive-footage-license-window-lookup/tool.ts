import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  dateDay,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly licenseInclusiveStartDate: string;
  readonly licenseExclusiveEndDate: string;
  readonly intendedUseDates: readonly string[];
  readonly callerLicensedMedia: readonly string[];
  readonly intendedUseMedia: readonly string[];
}>;
export type Output = Readonly<{
  readonly outsideCallerLicenseWindowUseIndices: readonly number[];
  readonly unlicensedMediaUseIndices: readonly number[];
  readonly allObservedUsesWithinCallerLicenseEvidence: boolean;
}>;
const inputFields = [
  {
    id: "licenseInclusiveStartDate",
    label: "License inclusive start date",
    kind: "string",
  },
  {
    id: "licenseExclusiveEndDate",
    label: "License exclusive end date",
    kind: "string",
  },
  { id: "intendedUseDates", label: "Intended use dates", kind: "stringList" },
  {
    id: "callerLicensedMedia",
    label: "Caller licensed media",
    kind: "stringList",
  },
  { id: "intendedUseMedia", label: "Intended use media", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.intendedUseDates, input.intendedUseMedia, "intendedUseDates");
  const start = dateDay(input.licenseInclusiveStartDate),
    end = dateDay(input.licenseExclusiveEndDate);
  if (end <= start)
    simpleError("window", "Positive explicit license window required.");
  unique(input.callerLicensedMedia, "media");
  const outside = input.intendedUseDates.flatMap((d, i) => {
      const t = dateDay(d);
      return t < start || t >= end ? [i] : [];
    }),
    media = input.intendedUseMedia.flatMap((v, i) =>
      !input.callerLicensedMedia.includes(v) ? [i] : [],
    );
  return {
    outsideCallerLicenseWindowUseIndices: outside,
    unlicensedMediaUseIndices: media,
    allObservedUsesWithinCallerLicenseEvidence:
      outside.length + media.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  licenseInclusiveStartDate: "2025-01-01",
  licenseExclusiveEndDate: "2025-02-01",
  intendedUseDates: ["2025-01-31", "2025-02-01"],
  callerLicensedMedia: ["broadcast"],
  intendedUseMedia: ["broadcast", "web"],
} satisfies Input;
export const exampleOutput = {
  outsideCallerLicenseWindowUseIndices: [1],
  unlicensedMediaUseIndices: [1],
  allObservedUsesWithinCallerLicenseEvidence: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/b-roll-archive-footage-license-window-lookup",
  title: "B Roll Archive Footage License Window Lookup",
  description:
    "Audit actual intended footage uses against caller licensed date/media evidence with exclusive end; no contract interpretation, territory/reuse limits, copyright/legal clearance or inference that caller evidence is complete.",
  inputs: inputFields,
  outputs: [
    {
      id: "outsideCallerLicenseWindowUseIndices",
      label: "Outside caller license window use indices",
      kind: "numberList",
    },
    {
      id: "unlicensedMediaUseIndices",
      label: "Unlicensed media use indices",
      kind: "numberList",
    },
    {
      id: "allObservedUsesWithinCallerLicenseEvidence",
      label: "All observed uses within caller license evidence",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      licenseInclusiveStartDate: value.licenseInclusiveStartDate as string,
      licenseExclusiveEndDate: value.licenseExclusiveEndDate as string,
      intendedUseDates: value.intendedUseDates as readonly string[],
      callerLicensedMedia: value.callerLicensedMedia as readonly string[],
      intendedUseMedia: value.intendedUseMedia as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
