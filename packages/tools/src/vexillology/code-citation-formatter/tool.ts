import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualStandardIdentifier: string;
  readonly actualVerifiedEdition: string;
  readonly actualQualifiedRecordCode: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStandardIdentifier",
    label: "Actual standard identifier",
    kind: "string",
  },
  {
    id: "actualVerifiedEdition",
    label: "Actual verified edition",
    kind: "string",
  },
  {
    id: "actualQualifiedRecordCode",
    label: "Actual qualified record code",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    [
      input.actualStandardIdentifier,
      input.actualVerifiedEdition,
      input.actualQualifiedRecordCode,
    ].some((v) => !v.trim() || /[\r\n]/.test(v))
  )
    simpleError("citation", "Nonblanksinglelineactualsourcecomponents.");
  return {
    formattedCitation:
      input.actualStandardIdentifier +
      ":" +
      input.actualVerifiedEdition +
      ", " +
      input.actualQualifiedRecordCode,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualStandardIdentifier: "ISO 3166-1",
    actualVerifiedEdition: "2020",
    actualQualifiedRecordCode: "GB",
  },
  output: { result: { formattedCitation: "ISO 3166-1:2020, GB" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/code-citation-formatter",
  title: "Flag Code Citation Formatter (ISO style)",
  description:
    "Explicitsource-edition-recordcitationformatter,no certifiesISOcode/referencepresenceor universalbibliographicstyle. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
