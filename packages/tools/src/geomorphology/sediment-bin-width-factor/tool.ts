import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerSize: number;
  readonly upperSize: number;
  readonly suppliedBinMass: number;
  readonly useLogWidth: boolean;
};
export type Output = { readonly width: number; readonly massPerWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSize: { type: "number", exclusiveMinimum: 0 },
    upperSize: { type: "number" },
    suppliedBinMass: { type: "number", minimum: 0 },
    useLogWidth: { type: "boolean" },
  },
  required: ["lowerSize", "upperSize", "suppliedBinMass", "useLogWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, massPerWidth: { type: "number" } },
  required: ["width", "massPerWidth"],
} as const;
/** Normalize supplied sediment-bin mass by explicit linear-size or natural-log-size width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerSize, upperSize, suppliedBinMass, useLogWidth } = request;
  const compute = (): Output => {
    H.domain(lowerSize > 0 && upperSize > lowerSize && suppliedBinMass >= 0);
    return {
      width: useLogWidth
        ? Math.log(upperSize / lowerSize)
        : upperSize - lowerSize,
      massPerWidth:
        suppliedBinMass /
        (useLogWidth ? Math.log(upperSize / lowerSize) : upperSize - lowerSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerSize: 1, upperSize: 3, suppliedBinMass: 8, useLogWidth: false },
  output: { width: 2, massPerWidth: 4 },
} satisfies ToolExample<Input, Output>;
export const sedimentBinWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/sediment-bin-width-factor",
    title: "Sediment Bin Width Factor Tool",
    description:
      "Normalize supplied sediment-bin mass by explicit linear-size or natural-log-size width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSize: { type: "number", exclusiveMinimum: 0 },
        upperSize: { type: "number" },
        suppliedBinMass: { type: "number", minimum: 0 },
        useLogWidth: { type: "boolean" },
      },
      required: ["lowerSize", "upperSize", "suppliedBinMass", "useLogWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        massPerWidth: { type: "number" },
      },
      required: ["width", "massPerWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lowerSize",
          label: "Lower Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperSize",
          label: "Upper Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBinMass",
          label: "Supplied Bin Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useLogWidth",
          label: "Use Log Width",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "massPerWidth",
          label: "Mass Per Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentBinWidthFactorTool.execute;
export default sedimentBinWidthFactorTool;
