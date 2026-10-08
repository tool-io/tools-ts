import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scribeId: string };
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scribeId: { type: "string", maxLength: 8192 } },
  required: ["scribeId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Construct a local TEI hand-reference fragment from an explicitly supplied restricted ASCII XML-name-shaped identifier without resolving a hand description. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scribeId } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z_][A-Za-z0-9_.-]*(?![\s\S])/.test(scribeId), "scribeId");
    return { reference: "#" + scribeId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scribeId: "hand_17" },
  output: { reference: "#hand_17" },
} satisfies ToolExample<Input, Output>;
export const teiHandShiftReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/tei-hand-shift-reference",
    title: "TEI Hand Shift Reference",
    description:
      "Construct a local TEI hand-reference fragment from an explicitly supplied restricted ASCII XML-name-shaped identifier without resolving a hand description.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scribeId: { type: "string", maxLength: 8192 } },
      required: ["scribeId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "scribeId",
          label: "Scribe Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = teiHandShiftReferenceTool.execute;
export default teiHandShiftReferenceTool;
