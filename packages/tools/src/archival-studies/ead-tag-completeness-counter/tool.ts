import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerApplicableEadRequiredQualifiedNames: readonly string[];
  readonly independentlyParsedPresentEadQualifiedNames: readonly string[];
  readonly parserEvidenceVerified: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerApplicableEadRequiredQualifiedNames",
    label: "Caller applicable ead required qualified names",
    kind: "stringList",
  },
  {
    id: "independentlyParsedPresentEadQualifiedNames",
    label: "Independently parsed present ead qualified names",
    kind: "stringList",
  },
  {
    id: "parserEvidenceVerified",
    label: "Parser evidence verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerApplicableEadRequiredQualifiedNames, "required");
  if (!input.parserEvidenceVerified)
    simpleError(
      "parser",
      "Independently namespace-aware parsed actual EAD tag evidence required.",
    );
  if (
    [
      ...input.callerApplicableEadRequiredQualifiedNames,
      ...input.independentlyParsedPresentEadQualifiedNames,
    ].some((v) => !/^\{[^{}]+\}[A-Za-z_][A-Za-z0-9_.-]*$/.test(v))
  )
    simpleError(
      "qualifiednames",
      "Explicit expanded namespace-qualified element names.",
    );
  const present = input.callerApplicableEadRequiredQualifiedNames.filter((v) =>
    input.independentlyParsedPresentEadQualifiedNames.includes(v),
  );
  return {
    presentCallerRequiredQualifiedNames: present,
    missingCallerRequiredQualifiedNames:
      input.callerApplicableEadRequiredQualifiedNames.filter(
        (v) => !input.independentlyParsedPresentEadQualifiedNames.includes(v),
      ),
    requiredTagPresenceFraction:
      present.length / input.callerApplicableEadRequiredQualifiedNames.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerApplicableEadRequiredQualifiedNames: [
      "{urn:isbn:1-931666-22-9}ead",
      "{urn:isbn:1-931666-22-9}archdesc",
    ],
    independentlyParsedPresentEadQualifiedNames: [
      "{urn:isbn:1-931666-22-9}ead",
    ],
    parserEvidenceVerified: true,
  },
  output: {
    result: {
      presentCallerRequiredQualifiedNames: ["{urn:isbn:1-931666-22-9}ead"],
      missingCallerRequiredQualifiedNames: ["{urn:isbn:1-931666-22-9}archdesc"],
      requiredTagPresenceFraction: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/ead-tag-completeness-counter",
  title: "Finding Aid EAD Tag Completeness Counter",
  description:
    "Count required EAD qualified-tag presence from independently namespace-aware parsed actual XML and edition/institution requirements, not regex XML parse or a complete schema/content/hierarchy validation. Duplicate actual tags allowed; source text/empty content and semantics external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
