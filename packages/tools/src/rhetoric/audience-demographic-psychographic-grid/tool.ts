import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerAudienceSegmentIds: readonly string[];
  readonly demographicContextNotes: readonly string[];
  readonly psychographicContextNotes: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerAudienceSegmentIds",
    label: "Caller audience segment ids",
    kind: "stringList",
  },
  {
    id: "demographicContextNotes",
    label: "Demographic context notes",
    kind: "stringList",
  },
  {
    id: "psychographicContextNotes",
    label: "Psychographic context notes",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerAudienceSegmentIds, "segments");
  aligned(
    input.callerAudienceSegmentIds,
    input.demographicContextNotes,
    "demographicnotes",
  );
  aligned(
    input.callerAudienceSegmentIds,
    input.psychographicContextNotes,
    "psychographicnotes",
  );
  return {
    segmentIds: [...input.callerAudienceSegmentIds],
    demographicNotes: [...input.demographicContextNotes],
    psychographicNotes: [...input.psychographicContextNotes],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAudienceSegmentIds: ["a", "b"],
    demographicContextNotes: [
      "independently reviewed context a",
      "independently reviewed context b",
    ],
    psychographicContextNotes: [
      "independently supplied goals a",
      "independently supplied goals b",
    ],
  },
  output: {
    result: {
      segmentIds: ["a", "b"],
      demographicNotes: [
        "independently reviewed context a",
        "independently reviewed context b",
      ],
      psychographicNotes: [
        "independently supplied goals a",
        "independently supplied goals b",
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/audience-demographic-psychographic-grid",
  title: "Audience Demographic Psychographic Grid",
  description:
    "Align independently consented caller segment/context notes without inferring sensitive traits, audience psychology, targeting eligibility or persuasion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
