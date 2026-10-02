import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly position: number;
  readonly offset: number;
  readonly sign: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "integer" },
    offset: { type: "integer" },
    sign: { type: "string", maxLength: 8192 },
  },
  required: ["position", "offset", "sign"],
} as const;
/** Parse a positive coding-position/intronic-offset subset without mapping it to a reference sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([1-9]\d*)([+-])([1-9]\d*)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const position = Number(match[1]),
      magnitude = Number(match[3]);
    H.integer(position, 1);
    H.integer(magnitude, 1);
    return {
      position,
      offset: match[2] === "-" ? -magnitude : magnitude,
      sign: match[2],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "123+4" },
  output: { position: 123, offset: 4, sign: "+" },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneHgvsIntronicOffsetSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/pharmacogene-hgvs-intronic-offset-sign",
    title: "Pharmacogene Hgvs Intronic Offset Sign Tool",
    description:
      "Parse a positive coding-position/intronic-offset subset without mapping it to a reference sequence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "integer" },
        offset: { type: "integer" },
        sign: { type: "string", maxLength: 8192 },
      },
      required: ["position", "offset", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "position", label: "Position", valueType: { type: "integer" } },
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
        { id: "sign", label: "Sign", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacogeneHgvsIntronicOffsetSignTool.execute;
export default pharmacogeneHgvsIntronicOffsetSignTool;
