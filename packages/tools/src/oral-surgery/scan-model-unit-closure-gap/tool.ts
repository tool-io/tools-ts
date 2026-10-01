import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scanDistance: number;
  readonly suppliedModelPerScanUnit: number;
  readonly modelDistance: number;
};
export type Output = {
  readonly convertedScanDistance: number;
  readonly closureGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scanDistance: { type: "number", minimum: 0 },
    suppliedModelPerScanUnit: { type: "number", exclusiveMinimum: 0 },
    modelDistance: { type: "number", minimum: 0 },
  },
  required: ["scanDistance", "suppliedModelPerScanUnit", "modelDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedScanDistance: { type: "number" },
    closureGap: { type: "number" },
  },
  required: ["convertedScanDistance", "closureGap"],
} as const;
/** Calculate scan model unit closure gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scanDistance, suppliedModelPerScanUnit, modelDistance } = request;
  const compute = (): Output => {
    H.domain(scanDistance >= 0 && modelDistance >= 0);
    H.positive(suppliedModelPerScanUnit);
    return {
      convertedScanDistance: scanDistance * suppliedModelPerScanUnit,
      closureGap: modelDistance - scanDistance * suppliedModelPerScanUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scanDistance: 20, suppliedModelPerScanUnit: 0.1, modelDistance: 3 },
  output: { convertedScanDistance: 2, closureGap: 1 },
} satisfies ToolExample<Input, Output>;
export const scanModelUnitClosureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/scan-model-unit-closure-gap",
    title: "Scan Model Unit Closure Gap Tool",
    description:
      "Calculate scan model unit closure gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scanDistance: { type: "number", minimum: 0 },
        suppliedModelPerScanUnit: { type: "number", exclusiveMinimum: 0 },
        modelDistance: { type: "number", minimum: 0 },
      },
      required: ["scanDistance", "suppliedModelPerScanUnit", "modelDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedScanDistance: { type: "number" },
        closureGap: { type: "number" },
      },
      required: ["convertedScanDistance", "closureGap"],
    },
    ports: {
      inputs: [
        {
          id: "scanDistance",
          label: "Scan Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedModelPerScanUnit",
          label: "Supplied Model Per Scan Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modelDistance",
          label: "Model Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedScanDistance",
          label: "Converted Scan Distance",
          valueType: { type: "number" },
        },
        {
          id: "closureGap",
          label: "Closure Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scanModelUnitClosureGapTool.execute;
export default scanModelUnitClosureGapTool;
