import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothId: string;
  readonly canalWording: string;
  readonly notationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothId: { type: "string", maxLength: 8192, minLength: 1 },
    canalWording: { type: "string", maxLength: 8192, minLength: 1 },
    notationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["toothId", "canalWording", "notationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicitly supplied canal-orifice wording and source without anatomical identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothId, canalWording, notationSource } = request;
  const compute = (): Output => {
    H.domain(toothId.length > 0, "toothId");
    H.domain(canalWording.length > 0, "canalWording");
    H.domain(notationSource.length > 0, "notationSource");
    return { token: JSON.stringify([toothId, canalWording, notationSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothId: "T17",
    canalWording: "canal A",
    notationSource: "Operator record",
  },
  output: { token: '["T17","canal A","Operator record"]' },
} satisfies ToolExample<Input, Output>;
export const canalOrificeLabelTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endodontics", "health and medicine"],
      keywords: ["endodontics", "health and medicine"],
    },
    id: "endodontics/canal-orifice-label",
    title: "Canal Orifice Label",
    description:
      "Record explicitly supplied canal-orifice wording and source without anatomical identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothId: { type: "string", maxLength: 8192, minLength: 1 },
        canalWording: { type: "string", maxLength: 8192, minLength: 1 },
        notationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["toothId", "canalWording", "notationSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "toothId",
          label: "Tooth Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "canalWording",
          label: "Canal Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notationSource",
          label: "Notation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = canalOrificeLabelTool.execute;
export default canalOrificeLabelTool;
