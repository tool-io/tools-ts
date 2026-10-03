import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
  readonly lower: number;
  readonly upper: number;
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
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["lowerClosed", "upperClosed", "lower", "upper"],
} as const;
/** Parse a finite decimal interval token with explicit open/closed endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^([[(])([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)([\])])(?![\s\S])/.exec(
        token,
      );
    H.domain(match, "token");
    const lower = Number(match[2]),
      upper = Number(match[3]);
    H.domain(
      Number.isFinite(lower) && Number.isFinite(upper) && upper >= lower,
      "token",
    );
    return {
      lowerClosed: match[1] === "[",
      upperClosed: match[4] === "]",
      lower,
      upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "[1,5)" },
  output: { lowerClosed: true, upperClosed: false, lower: 1, upper: 5 },
} satisfies ToolExample<Input, Output>;
export const qcSpecificationOpenClosedBoundaryTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-control/qc-specification-open-closed-boundary-token",
      title: "QC Specification Open Closed Boundary Token Tool",
      description:
        "Parse a finite decimal interval token with explicit open/closed endpoints.",
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
          lowerClosed: { type: "boolean" },
          upperClosed: { type: "boolean" },
          lower: { type: "number" },
          upper: { type: "number" },
        },
        required: ["lowerClosed", "upperClosed", "lower", "upper"],
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
          {
            id: "lowerClosed",
            label: "Lower Closed",
            valueType: { type: "boolean" },
          },
          {
            id: "upperClosed",
            label: "Upper Closed",
            valueType: { type: "boolean" },
          },
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = qcSpecificationOpenClosedBoundaryTokenTool.execute;
export default qcSpecificationOpenClosedBoundaryTokenTool;
