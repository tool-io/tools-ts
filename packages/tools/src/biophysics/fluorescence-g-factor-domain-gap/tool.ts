import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parallel: number;
  readonly perpendicular: number;
  readonly suppliedG: number;
};
export type Output = {
  readonly denominator: number;
  readonly defined: boolean;
  readonly anisotropy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallel: { type: "number", minimum: 0 },
    perpendicular: { type: "number", minimum: 0 },
    suppliedG: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["parallel", "perpendicular", "suppliedG"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    defined: { type: "boolean" },
    anisotropy: { type: "number" },
  },
  required: ["denominator", "defined", "anisotropy"],
} as const;
/** Supplied G-corrected fluorescence anisotropy with an explicit zero-signal defined flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parallel, perpendicular, suppliedG } = request;
  const compute = (): Output => {
    H.domain(parallel >= 0 && perpendicular >= 0);
    H.positive(suppliedG);
    return {
      denominator: parallel + 2 * suppliedG * perpendicular,
      defined: parallel + 2 * suppliedG * perpendicular !== 0,
      anisotropy:
        parallel + 2 * suppliedG * perpendicular !== 0
          ? (parallel - suppliedG * perpendicular) /
            (parallel + 2 * suppliedG * perpendicular)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parallel: 4, perpendicular: 1, suppliedG: 1 },
  output: { denominator: 6, defined: true, anisotropy: 0.5 },
} satisfies ToolExample<Input, Output>;
export const fluorescenceGFactorDomainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/fluorescence-g-factor-domain-gap",
    title: "Fluorescence G Factor Domain Gap Tool",
    description:
      "Supplied G-corrected fluorescence anisotropy with an explicit zero-signal defined flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parallel: { type: "number", minimum: 0 },
        perpendicular: { type: "number", minimum: 0 },
        suppliedG: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["parallel", "perpendicular", "suppliedG"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        defined: { type: "boolean" },
        anisotropy: { type: "number" },
      },
      required: ["denominator", "defined", "anisotropy"],
    },
    ports: {
      inputs: [
        {
          id: "parallel",
          label: "Parallel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perpendicular",
          label: "Perpendicular",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedG",
          label: "Supplied G",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "anisotropy",
          label: "Anisotropy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluorescenceGFactorDomainGapTool.execute;
export default fluorescenceGFactorDomainGapTool;
