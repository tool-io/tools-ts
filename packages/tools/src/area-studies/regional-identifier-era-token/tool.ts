import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string; readonly delimiter: string };
export type Output = {
  readonly regionToken: string;
  readonly eraToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["identifier", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionToken: { type: "string", maxLength: 8192 },
    eraToken: { type: "string", maxLength: 8192 },
  },
  required: ["regionToken", "eraToken"],
} as const;
/** Split an opaque public regional identifier and era token under an explicit grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, delimiter } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0);
    const a = identifier.split(delimiter);
    H.domain(a.length === 2 && a.every((x) => x.length > 0));
    return { regionToken: a[0], eraToken: a[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "R1:EraA", delimiter: ":" },
  output: { regionToken: "R1", eraToken: "EraA" },
} satisfies ToolExample<Input, Output>;
export const regionalIdentifierEraTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/regional-identifier-era-token",
    title: "Regional Identifier Era Token Tool",
    description:
      "Split an opaque public regional identifier and era token under an explicit grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
      },
      required: ["identifier", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionToken: { type: "string", maxLength: 8192 },
        eraToken: { type: "string", maxLength: 8192 },
      },
      required: ["regionToken", "eraToken"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "regionToken",
          label: "Region Token",
          valueType: { type: "string" },
        },
        { id: "eraToken", label: "Era Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = regionalIdentifierEraTokenTool.execute;
export default regionalIdentifierEraTokenTool;
