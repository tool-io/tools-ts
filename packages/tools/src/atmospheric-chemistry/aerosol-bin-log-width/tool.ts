import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerDiameter: number;
  readonly upperDiameter: number;
  readonly logBase: number;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerDiameter: { type: "number", exclusiveMinimum: 0 },
    upperDiameter: { type: "number" },
    logBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["lowerDiameter", "upperDiameter", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" } },
  required: ["width"],
} as const;
/** Calculate aerosol bin log width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerDiameter, upperDiameter, logBase } = request;
  const compute = (): Output => {
    H.positive(lowerDiameter);
    H.domain(upperDiameter >= lowerDiameter && logBase > 1);
    const relativeWidth = (upperDiameter - lowerDiameter) / lowerDiameter,
      logWidth = Number.isFinite(relativeWidth)
        ? Math.log1p(relativeWidth)
        : Math.log(upperDiameter) - Math.log(lowerDiameter);
    return { width: logWidth / Math.log(logBase) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerDiameter: 1, upperDiameter: 4, logBase: 2 },
  output: { width: 2 },
} satisfies ToolExample<Input, Output>;
export const aerosolBinLogWidthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "atmospheric-chemistry/aerosol-bin-log-width",
    title: "Aerosol Bin Log Width Tool",
    description:
      "Calculate aerosol bin log width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerDiameter: { type: "number", exclusiveMinimum: 0 },
        upperDiameter: { type: "number" },
        logBase: { type: "number", exclusiveMinimum: 1 },
      },
      required: ["lowerDiameter", "upperDiameter", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "lowerDiameter",
          label: "Lower Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperDiameter",
          label: "Upper Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "width", label: "Width", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = aerosolBinLogWidthTool.execute;
export default aerosolBinLogWidthTool;
