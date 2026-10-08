import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly facsimileId: string;
  readonly leafText: string;
  readonly sideToken: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    facsimileId: { type: "string", maxLength: 8192, minLength: 1 },
    leafText: { type: "string", maxLength: 8192, minLength: 1 },
    sideToken: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["facsimileId", "leafText", "sideToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an exact facsimile page key from supplied leaf text and side token without imposing a foliation system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { facsimileId, leafText, sideToken } = request;
  const compute = (): Output => {
    H.domain(facsimileId.length > 0, "facsimileId");
    H.domain(leafText.length > 0, "leafText");
    H.domain(sideToken.length > 0, "sideToken");
    return { token: JSON.stringify([facsimileId, leafText, sideToken]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { facsimileId: "F17", leafText: "24", sideToken: "r" },
  output: { token: '["F17","24","r"]' },
} satisfies ToolExample<Input, Output>;
export const facsimileRectoVersoPageKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/facsimile-recto-verso-page-key",
    title: "Facsimile Recto Verso Page Key Tool",
    description:
      "Build an exact facsimile page key from supplied leaf text and side token without imposing a foliation system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        facsimileId: { type: "string", maxLength: 8192, minLength: 1 },
        leafText: { type: "string", maxLength: 8192, minLength: 1 },
        sideToken: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["facsimileId", "leafText", "sideToken"],
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
          id: "facsimileId",
          label: "Facsimile Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leafText",
          label: "Leaf Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sideToken",
          label: "Side Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = facsimileRectoVersoPageKeyTool.execute;
export default facsimileRectoVersoPageKeyTool;
