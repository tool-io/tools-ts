import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerDocumentedNativeSpeakers: number;
  readonly callerDocumentedAdditionalNonNativeSpeakers: number;
  readonly callerDisjointPopulationDefinitionVerified: boolean;
}>;
export type Output = Readonly<{
  readonly conditionalTotalSpeakersMillions: number;
}>;
const inputFields = [
  {
    id: "callerDocumentedNativeSpeakers",
    label: "Caller documented native speakers",
    kind: "number",
  },
  {
    id: "callerDocumentedAdditionalNonNativeSpeakers",
    label: "Caller documented additional non native speakers",
    kind: "number",
  },
  {
    id: "callerDisjointPopulationDefinitionVerified",
    label: "Caller disjoint population definition verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerDocumentedNativeSpeakers,
    "callerDocumentedNativeSpeakers",
  );
  nonnegative(
    input.callerDocumentedAdditionalNonNativeSpeakers,
    "callerDocumentedAdditionalNonNativeSpeakers",
  );
  integer(input.callerDocumentedNativeSpeakers, "speakers");
  integer(input.callerDocumentedAdditionalNonNativeSpeakers, "speakers");
  if (!input.callerDisjointPopulationDefinitionVerified)
    simpleError(
      "definition",
      "Independent disjoint native/additional nonnative evidence required.",
    );
  return {
    conditionalTotalSpeakersMillions:
      integer(
        Number(
          BigInt(input.callerDocumentedNativeSpeakers) +
            BigInt(input.callerDocumentedAdditionalNonNativeSpeakers),
        ),
        "summed speakers",
      ) / 1000000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDocumentedNativeSpeakers: 1000000,
  callerDocumentedAdditionalNonNativeSpeakers: 500000,
  callerDisjointPopulationDefinitionVerified: true,
} satisfies Input;
export const exampleOutput = {
  conditionalTotalSpeakersMillions: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/speakers-per-language-millions-lookup",
  title: "Speakers Per Language Millions Lookup",
  description:
    "Aggregate independently documented nonoverlapping speaker populations in millions, not double-counted native/L2totals or fixed-language lookup. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalTotalSpeakersMillions",
      label: "Conditional total speakers millions",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDocumentedNativeSpeakers:
        value.callerDocumentedNativeSpeakers as number,
      callerDocumentedAdditionalNonNativeSpeakers:
        value.callerDocumentedAdditionalNonNativeSpeakers as number,
      callerDisjointPopulationDefinitionVerified:
        value.callerDisjointPopulationDefinitionVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
