import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAxisDegrees: number;
  readonly secondAxisDegrees: number;
  readonly suppliedReferenceGap: number;
};
export type Output = {
  readonly unorientedGap: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxisDegrees: { type: "number" },
    secondAxisDegrees: { type: "number" },
    suppliedReferenceGap: { type: "number", minimum: 0, maximum: 90 },
  },
  required: ["firstAxisDegrees", "secondAxisDegrees", "suppliedReferenceGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unorientedGap: { type: "number" },
    residual: { type: "number" },
  },
  required: ["unorientedGap", "residual"],
} as const;
/** Calculate optical axis reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAxisDegrees, secondAxisDegrees, suppliedReferenceGap } = request;
  const compute = (): Output => {
    H.domain(suppliedReferenceGap >= 0 && suppliedReferenceGap <= 90);
    return (() => {
      const r = ((secondAxisDegrees % 180) - (firstAxisDegrees % 180)) % 180,
        p = r < 0 ? r + 180 : r,
        unorientedGap = Math.min(p, 180 - p);
      return { unorientedGap, residual: unorientedGap - suppliedReferenceGap };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAxisDegrees: 170,
    secondAxisDegrees: 10,
    suppliedReferenceGap: 15,
  },
  output: { unorientedGap: 20, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const opticalAxisReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/optical-axis-reference-gap",
    title: "Optical Axis Reference Gap Tool",
    description:
      "Calculate optical axis reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAxisDegrees: { type: "number" },
        secondAxisDegrees: { type: "number" },
        suppliedReferenceGap: { type: "number", minimum: 0, maximum: 90 },
      },
      required: [
        "firstAxisDegrees",
        "secondAxisDegrees",
        "suppliedReferenceGap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unorientedGap: { type: "number" },
        residual: { type: "number" },
      },
      required: ["unorientedGap", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstAxisDegrees",
          label: "First Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAxisDegrees",
          label: "Second Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceGap",
          label: "Supplied Reference Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unorientedGap",
          label: "Unoriented Gap",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = opticalAxisReferenceGapTool.execute;
export default opticalAxisReferenceGapTool;
