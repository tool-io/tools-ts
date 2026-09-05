import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerStyle: string;
  readonly independentlyAmbiguityRequiresComma: boolean;
}>;
export type Output = Readonly<{
  readonly serialCommaRecommendedByDeclaredRule: boolean;
}>;
const inputFields = [
  { id: "callerStyle", label: "Caller style", kind: "string" },
  {
    id: "independentlyAmbiguityRequiresComma",
    label: "Independently ambiguity requires comma",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  pick(input.callerStyle, { ap: 0, chicago: 1 }, "style");
  return {
    serialCommaRecommendedByDeclaredRule:
      input.callerStyle === "chicago" ||
      input.independentlyAmbiguityRequiresComma,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStyle: "ap",
  independentlyAmbiguityRequiresComma: true,
} satisfies Input;
export const exampleOutput = {
  serialCommaRecommendedByDeclaredRule: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/serial-comma-ap-vs-chicago-crossref-lookup",
  title: "Serial Comma AP vs Chicago Crossref Lookup",
  description:
    "Basic AP avoids routine serial comma except independently identified ambiguity; Chicago default includes it. Not infer list syntax/ambiguity or universal all-edition rule. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "serialCommaRecommendedByDeclaredRule",
      label: "Serial comma recommended by declared rule",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStyle: value.callerStyle as string,
      independentlyAmbiguityRequiresComma:
        value.independentlyAmbiguityRequiresComma as boolean,
    }),
});
export const run = tool.execute;
export default tool;
