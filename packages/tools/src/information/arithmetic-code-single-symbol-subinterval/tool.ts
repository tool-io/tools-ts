import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly cumulativeLower: number;
  readonly cumulativeUpper: number;
};
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number", minimum: 0 },
    upper: { type: "number", maximum: 1 },
    cumulativeLower: { type: "number", minimum: 0 },
    cumulativeUpper: { type: "number", maximum: 1 },
  },
  required: ["lower", "upper", "cumulativeLower", "cumulativeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Calculate arithmetic code single symbol subinterval from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lower, upper, cumulativeLower, cumulativeUpper } = input;
  const compute = (): Output => {
    H.domain(
      lower >= 0 &&
        upper <= 1 &&
        lower < upper &&
        cumulativeLower >= 0 &&
        cumulativeUpper <= 1 &&
        cumulativeLower < cumulativeUpper,
    );
    const width = upper - lower;
    return {
      lower: lower + width * cumulativeLower,
      upper: lower + width * cumulativeUpper,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    lower: 0.25,
    upper: 0.75,
    cumulativeLower: 0.25,
    cumulativeUpper: 0.5,
  },
  output: { lower: 0.375, upper: 0.5 },
} satisfies ToolExample<Input, Output>;
export const arithmeticCodeSingleSymbolSubintervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/arithmetic-code-single-symbol-subinterval",
      title: "Arithmetic Code Single Symbol Subinterval Tool",
      description:
        "Calculate arithmetic code single symbol subinterval from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number", minimum: 0 },
          upper: { type: "number", maximum: 1 },
          cumulativeLower: { type: "number", minimum: 0 },
          cumulativeUpper: { type: "number", maximum: 1 },
        },
        required: ["lower", "upper", "cumulativeLower", "cumulativeUpper"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lower: { type: "number" }, upper: { type: "number" } },
        required: ["lower", "upper"],
      },
      ports: {
        inputs: [
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cumulativeLower",
            label: "Cumulative Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cumulativeUpper",
            label: "Cumulative Upper",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = arithmeticCodeSingleSymbolSubintervalTool.execute;
export default arithmeticCodeSingleSymbolSubintervalTool;
