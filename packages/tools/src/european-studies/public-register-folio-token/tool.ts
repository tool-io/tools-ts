import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly prefix: string;
  readonly rectoToken: string;
  readonly versoToken: string;
};
export type Output = { readonly folio: number; readonly side: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
    rectoToken: { type: "string", maxLength: 8192 },
    versoToken: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix", "rectoToken", "versoToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folio: { type: "integer" },
    side: { type: "string", maxLength: 8192 },
  },
  required: ["folio", "side"],
} as const;
/** Parse a positive decimal folio and unambiguous caller-supplied side suffix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix, rectoToken, versoToken } = request;
  const compute = (): Output => {
    H.domain(
      prefix.length > 0 &&
        rectoToken.length > 0 &&
        versoToken.length > 0 &&
        rectoToken !== versoToken &&
        token.startsWith(prefix),
    );
    const tail = token.slice(prefix.length),
      sides = [rectoToken, versoToken].filter(
        (x) =>
          tail.endsWith(x) &&
          /^[1-9]\d*(?![\s\S])/.test(tail.slice(0, -x.length)),
      );
    H.domain(sides.length === 1);
    const side = sides[0],
      folio = Number(tail.slice(0, -side.length));
    H.integer(folio, 1);
    return { folio, side };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "f12v", prefix: "f", rectoToken: "r", versoToken: "v" },
  output: { folio: 12, side: "v" },
} satisfies ToolExample<Input, Output>;
export const publicRegisterFolioTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/public-register-folio-token",
    title: "Public Register Folio Token Tool",
    description:
      "Parse a positive decimal folio and unambiguous caller-supplied side suffix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
        rectoToken: { type: "string", maxLength: 8192 },
        versoToken: { type: "string", maxLength: 8192 },
      },
      required: ["token", "prefix", "rectoToken", "versoToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folio: { type: "integer" },
        side: { type: "string", maxLength: 8192 },
      },
      required: ["folio", "side"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rectoToken",
          label: "Recto Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versoToken",
          label: "Verso Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "folio", label: "Folio", valueType: { type: "integer" } },
        { id: "side", label: "Side", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicRegisterFolioTokenTool.execute;
export default publicRegisterFolioTokenTool;
