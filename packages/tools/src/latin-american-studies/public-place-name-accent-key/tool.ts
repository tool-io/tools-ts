import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string; readonly caseFold: boolean };
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    caseFold: { type: "boolean" },
  },
  required: ["name", "caseFold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Produce an explicitly accent-insensitive public label key by NFD Mark removal, without asserting place identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, caseFold } = request;
  const compute = (): Output => {
    return {
      key: (caseFold ? name.toLowerCase() : name)
        .normalize("NFD")
        .replace(/\p{M}/gu, ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Bogotá", caseFold: true },
  output: { key: "bogota" },
} satisfies ToolExample<Input, Output>;
export const publicPlaceNameAccentKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/public-place-name-accent-key",
    title: "Public Place Name Accent Key Tool",
    description:
      "Produce an explicitly accent-insensitive public label key by NFD Mark removal, without asserting place identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        caseFold: { type: "boolean" },
      },
      required: ["name", "caseFold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseFold",
          label: "Case Fold",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicPlaceNameAccentKeyTool.execute;
export default publicPlaceNameAccentKeyTool;
