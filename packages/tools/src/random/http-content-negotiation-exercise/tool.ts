import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  corpus,
  simpleError,
  unique,
} from "../batch42-shared.js";
import base from "../../http/accept-parser/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
  readonly offeredMediaTypes: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "candidateInputsJson",
    label: "Candidate inputs json",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const fields = [
  ...inputFields,
  {
    id: "offeredMediaTypes",
    label: "Explicit parameter-free offered media types",
    kind: "stringList",
  } as const,
];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const offers = input.offeredMediaTypes.map((v) => v.toLowerCase());
  unique(offers, "offers");
  if (
    offers.some(
      (v) => !/^[a-z0-9!#$%&'+.^_`|~-]+\/[a-z0-9!#$%&'+.^_`|~-]+$/.test(v),
    )
  )
    simpleError(
      "offers",
      "Literal parameter-free media types; no offered wildcards.",
    );
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => {
    const parsed = e.answer as {
      ranges: readonly {
        range: string;
        quality: number;
        parameters: readonly object[];
      }[];
    };
    if (parsed.ranges.some((r) => r.parameters.length))
      simpleError(
        "header",
        "This explicit exercise submodel excludes media parameters and accept extensions.",
      );
    const qualities = offers.map((offer) => {
      const matching = parsed.ranges
        .map((r) => ({
          quality: r.quality,
          specificity:
            r.range.toLowerCase() === offer
              ? 2
              : r.range.toLowerCase() === offer.split("/")[0] + "/*"
                ? 1
                : r.range === "*/*"
                  ? 0
                  : -1,
        }))
        .filter((r) => r.specificity >= 0);
      if (!matching.length) return 0;
      const specificity = Math.max(...matching.map((r) => r.specificity));
      const possible = [
        ...new Set(
          matching
            .filter((r) => r.specificity === specificity)
            .map((r) => r.quality),
        ),
      ];
      if (possible.length !== 1)
        simpleError(
          "header",
          "Conflicting qualities on equally specific duplicate ranges remain ambiguous; no inferred precedence.",
        );
      return possible[0];
    });
    const highestQuality = Math.max(...qualities);
    return {
      ...e,
      negotiation: {
        offeredMediaTypes: input.offeredMediaTypes,
        qualities,
        bestOfferIndices: qualities.flatMap((q, i) =>
          q > 0 && q === highestQuality ? [i] : [],
        ),
      },
    };
  });
  return { result: { ...drawn.result, exercises } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, fields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: [
      '{"header": "text/html; q=0.8, application/json; q=1"}',
    ],
    offeredMediaTypes: ["text/html", "application/json"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/http-content-negotiation-exercise",
  title: "Random HTTP Content Negotiation Exercise Generator",
  description:
    "Build reproducible Accept-header negotiation cards with imported parsing and explicit parameter-free offered media types. Most-specific range determines each quality; zero-quality offers excluded and best-quality ties retained. Conflicting duplicate qualities or media parameters/extensions fail this bounded submodel rather than infer precedence. Uniform caller candidate-position sampling with explicit replacement; not a full HTTP server negotiation or precondition implementation.",
  inputs: fields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
