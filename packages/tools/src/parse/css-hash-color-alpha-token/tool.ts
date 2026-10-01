import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;
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
    red: { type: "integer" },
    green: { type: "integer" },
    blue: { type: "integer" },
    alpha: { type: "number" },
  },
  required: ["red", "green", "blue", "alpha"],
} as const;
/** Calculate css hash color alpha token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(/^#(?:[0-9a-fA-F]{4}|[0-9a-fA-F]{8})(?![\s\S])/.test(token));
    const h =
      token.length === 5
        ? Array.from(token.slice(1), (c) => c + c).join("")
        : token.slice(1);
    return {
      red: parseInt(h.slice(0, 2), 16),
      green: parseInt(h.slice(2, 4), 16),
      blue: parseInt(h.slice(4, 6), 16),
      alpha: parseInt(h.slice(6, 8), 16) / 255,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "#f008" },
  output: { red: 255, green: 0, blue: 0, alpha: 0.5333333333333333 },
} satisfies ToolExample<Input, Output>;
export const cssHashColorAlphaTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/css-hash-color-alpha-token",
    title: "Css Hash Color Alpha Token Tool",
    description:
      "Calculate css hash color alpha token from explicit caller-supplied inputs.",
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
        red: { type: "integer" },
        green: { type: "integer" },
        blue: { type: "integer" },
        alpha: { type: "number" },
      },
      required: ["red", "green", "blue", "alpha"],
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
        { id: "red", label: "Red", valueType: { type: "integer" } },
        { id: "green", label: "Green", valueType: { type: "integer" } },
        { id: "blue", label: "Blue", valueType: { type: "integer" } },
        { id: "alpha", label: "Alpha", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cssHashColorAlphaTokenTool.execute;
export default cssHashColorAlphaTokenTool;
