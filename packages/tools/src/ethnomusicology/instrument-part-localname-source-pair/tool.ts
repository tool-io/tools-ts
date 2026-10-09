import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentId: string;
  readonly suppliedPartName: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPartName: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentId", "suppliedPartName", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit instrument-part local name and source without imposing an organological taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentId, suppliedPartName, sourceId } = request;
  const compute = (): Output => {
    H.domain(instrumentId.length > 0, "instrumentId");
    H.domain(suppliedPartName.length > 0, "suppliedPartName");
    H.domain(sourceId.length > 0, "sourceId");
    return {
      token: JSON.stringify([instrumentId, suppliedPartName, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instrumentId: "I17",
    suppliedPartName: "local term A",
    sourceId: "S4",
  },
  output: { token: '["I17","local term A","S4"]' },
} satisfies ToolExample<Input, Output>;
export const instrumentPartLocalnameSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/instrument-part-localname-source-pair",
    title: "Instrument Part Localname Source Pair Tool",
    description:
      "Record an explicit instrument-part local name and source without imposing an organological taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPartName: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["instrumentId", "suppliedPartName", "sourceId"],
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
          id: "instrumentId",
          label: "Instrument Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPartName",
          label: "Supplied Part Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = instrumentPartLocalnameSourcePairTool.execute;
export default instrumentPartLocalnameSourcePairTool;
