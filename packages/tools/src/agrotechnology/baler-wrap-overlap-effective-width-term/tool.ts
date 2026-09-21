import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly filmWidth: number;
  readonly overlapFraction: number;
  readonly baleLength: number;
  readonly endAllowance: number;
};
export type Output = {
  readonly effectiveAdvance: number;
  readonly turns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filmWidth: { type: "number", exclusiveMinimum: 0 },
    overlapFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    baleLength: { type: "number", minimum: 0 },
    endAllowance: { type: "number", minimum: 0 },
  },
  required: ["filmWidth", "overlapFraction", "baleLength", "endAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveAdvance: { type: "number" },
    turns: { type: "integer" },
  },
  required: ["effectiveAdvance", "turns"],
} as const;
/** Calculate baler wrap overlap effective width term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filmWidth, overlapFraction, baleLength, endAllowance } = request;
  const compute = (): Output => {
    H.positive(filmWidth);
    H.domain(
      overlapFraction >= 0 &&
        overlapFraction < 1 &&
        baleLength >= 0 &&
        endAllowance >= 0,
    );
    return {
      effectiveAdvance: filmWidth * (1 - overlapFraction),
      turns: Math.ceil(
        (baleLength + 2 * endAllowance) / (filmWidth * (1 - overlapFraction)),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    filmWidth: 0.5,
    overlapFraction: 0.5,
    baleLength: 2,
    endAllowance: 0.25,
  },
  output: { effectiveAdvance: 0.25, turns: 10 },
} satisfies ToolExample<Input, Output>;
export const balerWrapOverlapEffectiveWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/baler-wrap-overlap-effective-width-term",
    title: "Baler Wrap Overlap Effective Width Term Tool",
    description:
      "Calculate baler wrap overlap effective width term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filmWidth: { type: "number", exclusiveMinimum: 0 },
        overlapFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        baleLength: { type: "number", minimum: 0 },
        endAllowance: { type: "number", minimum: 0 },
      },
      required: ["filmWidth", "overlapFraction", "baleLength", "endAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveAdvance: { type: "number" },
        turns: { type: "integer" },
      },
      required: ["effectiveAdvance", "turns"],
    },
    ports: {
      inputs: [
        {
          id: "filmWidth",
          label: "Film Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapFraction",
          label: "Overlap Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "baleLength",
          label: "Bale Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endAllowance",
          label: "End Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveAdvance",
          label: "Effective Advance",
          valueType: { type: "number" },
        },
        { id: "turns", label: "Turns", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = balerWrapOverlapEffectiveWidthTermTool.execute;
export default balerWrapOverlapEffectiveWidthTermTool;
