import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly expectedPrefix: string;
  readonly sourceEdition: string;
};
export type Output = { readonly tipCode: string; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    expectedPrefix: { type: "string", maxLength: 8192 },
    sourceEdition: { type: "string", maxLength: 8192 },
  },
  required: ["code", "expectedPrefix", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipCode: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["tipCode", "sourceKey"],
} as const;
/** Split a supplied three-digit tip code while retaining its explicit source edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, expectedPrefix, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(
      expectedPrefix.length > 0 &&
        sourceEdition.length > 0 &&
        code.startsWith(expectedPrefix),
      "code",
    );
    const tipCode = code.slice(expectedPrefix.length);
    H.domain(/^\d{3}(?![\s\S])/.test(tipCode), "code");
    return {
      tipCode,
      sourceKey: JSON.stringify([sourceEdition, expectedPrefix, tipCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "ISO-025",
    expectedPrefix: "ISO-",
    sourceEdition: "edition-A",
  },
  output: { tipCode: "025", sourceKey: '["edition-A","ISO-","025"]' },
} satisfies ToolExample<Input, Output>;
export const endodonticInstrumentTipCodeSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/endodontic-instrument-tip-code-source",
    title: "Endodontic Instrument Tip Code Source Tool",
    description:
      "Split a supplied three-digit tip code while retaining its explicit source edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        expectedPrefix: { type: "string", maxLength: 8192 },
        sourceEdition: { type: "string", maxLength: 8192 },
      },
      required: ["code", "expectedPrefix", "sourceEdition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipCode: { type: "string", maxLength: 8192 },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["tipCode", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedPrefix",
          label: "Expected Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "tipCode", label: "Tip Code", valueType: { type: "string" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = endodonticInstrumentTipCodeSourceTool.execute;
export default endodonticInstrumentTipCodeSourceTool;
