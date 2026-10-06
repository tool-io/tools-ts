import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly printedName: string;
  readonly suppliedAlias: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    printedName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAlias: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "printedName", "suppliedAlias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied point-name strings with their source without asserting an anatomical equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, printedName, suppliedAlias } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(printedName.length > 0, "printedName");
    H.domain(suppliedAlias.length > 0, "suppliedAlias");
    return { token: JSON.stringify([sourceId, printedName, suppliedAlias]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "AT17", printedName: "Point A", suppliedAlias: "Alias B" },
  output: { token: '["AT17","Point A","Alias B"]' },
} satisfies ToolExample<Input, Output>;
export const acupunctureTextPointAliasTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupuncture-text-point-alias",
    title: "Acupuncture Text Point Alias",
    description:
      "Pair explicitly supplied point-name strings with their source without asserting an anatomical equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        printedName: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAlias: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "printedName", "suppliedAlias"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedName",
          label: "Printed Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAlias",
          label: "Supplied Alias",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = acupunctureTextPointAliasTool.execute;
export default acupunctureTextPointAliasTool;
