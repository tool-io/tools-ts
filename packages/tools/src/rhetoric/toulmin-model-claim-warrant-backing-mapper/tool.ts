import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerAnnotatedComponentLabels: readonly string[];
  readonly callerAnnotatedComponentTexts: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerAnnotatedComponentLabels",
    label: "Caller annotated component labels",
    kind: "stringList",
  },
  {
    id: "callerAnnotatedComponentTexts",
    label: "Caller annotated component texts",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const supported = [
    "claim",
    "grounds",
    "warrant",
    "backing",
    "qualifier",
    "rebuttal",
  ];
  unique(input.callerAnnotatedComponentLabels, "components");
  aligned(
    input.callerAnnotatedComponentLabels,
    input.callerAnnotatedComponentTexts,
    "texts",
  );
  if (
    input.callerAnnotatedComponentLabels.some((v) => !supported.includes(v)) ||
    input.callerAnnotatedComponentTexts.some((v) => !v.trim())
  )
    simpleError(
      "components",
      "Independently annotated supported Toulmin labels and nonempty texts.",
    );
  return {
    componentLabels: [...input.callerAnnotatedComponentLabels],
    componentTexts: [...input.callerAnnotatedComponentTexts],
    missingComponents: supported.filter(
      (v) => !input.callerAnnotatedComponentLabels.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAnnotatedComponentLabels: [
      "claim",
      "grounds",
      "warrant",
      "backing",
      "qualifier",
      "rebuttal",
    ],
    callerAnnotatedComponentTexts: [
      "claim a",
      "grounds a",
      "warrant a",
      "backing a",
      "qualifier a",
      "rebuttal a",
    ],
  },
  output: {
    result: {
      componentLabels: [
        "claim",
        "grounds",
        "warrant",
        "backing",
        "qualifier",
        "rebuttal",
      ],
      componentTexts: [
        "claim a",
        "grounds a",
        "warrant a",
        "backing a",
        "qualifier a",
        "rebuttal a",
      ],
      missingComponents: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/toulmin-model-claim-warrant-backing-mapper",
  title: "Toulmin Model Claim Warrant Backing Mapper",
  description:
    "Map explicit caller Toulmin component annotations, retaining absent components rather than inferring claims/warrants or soundness from raw text.",
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
