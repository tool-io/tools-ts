import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boreDiameter: number;
  readonly closureDiameter: number;
  readonly toleranceBore: number;
  readonly toleranceClosure: number;
};
export type Output = {
  readonly nominalGap: number;
  readonly minimumGap: number;
  readonly maximumGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boreDiameter: { type: "number", minimum: 0 },
    closureDiameter: { type: "number", minimum: 0 },
    toleranceBore: { type: "number", minimum: 0 },
    toleranceClosure: { type: "number", minimum: 0 },
  },
  required: [
    "boreDiameter",
    "closureDiameter",
    "toleranceBore",
    "toleranceClosure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalGap: { type: "number" },
    minimumGap: { type: "number" },
    maximumGap: { type: "number" },
  },
  required: ["nominalGap", "minimumGap", "maximumGap"],
} as const;
/** Calculate pharmaceutical container closure bench clearance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boreDiameter, closureDiameter, toleranceBore, toleranceClosure } =
    request;
  const compute = (): Output => {
    H.domain(
      boreDiameter >= 0 &&
        closureDiameter >= 0 &&
        toleranceBore >= 0 &&
        toleranceClosure >= 0,
    );
    return {
      nominalGap: boreDiameter - closureDiameter,
      minimumGap:
        boreDiameter - closureDiameter - toleranceBore - toleranceClosure,
      maximumGap:
        boreDiameter - closureDiameter + toleranceBore + toleranceClosure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    boreDiameter: 20,
    closureDiameter: 19,
    toleranceBore: 0.1,
    toleranceClosure: 0.2,
  },
  output: { nominalGap: 1, minimumGap: 0.7, maximumGap: 1.3 },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalContainerClosureBenchClearanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/pharmaceutical-container-closure-bench-clearance",
      title: "Pharmaceutical Container Closure Bench Clearance Tool",
      description:
        "Calculate pharmaceutical container closure bench clearance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          boreDiameter: { type: "number", minimum: 0 },
          closureDiameter: { type: "number", minimum: 0 },
          toleranceBore: { type: "number", minimum: 0 },
          toleranceClosure: { type: "number", minimum: 0 },
        },
        required: [
          "boreDiameter",
          "closureDiameter",
          "toleranceBore",
          "toleranceClosure",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalGap: { type: "number" },
          minimumGap: { type: "number" },
          maximumGap: { type: "number" },
        },
        required: ["nominalGap", "minimumGap", "maximumGap"],
      },
      ports: {
        inputs: [
          {
            id: "boreDiameter",
            label: "Bore Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "closureDiameter",
            label: "Closure Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "toleranceBore",
            label: "Tolerance Bore",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "toleranceClosure",
            label: "Tolerance Closure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nominalGap",
            label: "Nominal Gap",
            valueType: { type: "number" },
          },
          {
            id: "minimumGap",
            label: "Minimum Gap",
            valueType: { type: "number" },
          },
          {
            id: "maximumGap",
            label: "Maximum Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalContainerClosureBenchClearanceTool.execute;
export default pharmaceuticalContainerClosureBenchClearanceTool;
