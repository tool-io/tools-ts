import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedSpeed: number;
  readonly timeStep: number;
  readonly cellWidth: number;
};
export type Output = {
  readonly signedCourantNumber: number;
  readonly absoluteCourantNumber: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSpeed: { type: "number" },
    timeStep: { type: "number", minimum: 0 },
    cellWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["signedSpeed", "timeStep", "cellWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedCourantNumber: { type: "number" },
    absoluteCourantNumber: { type: "number" },
  },
  required: ["signedCourantNumber", "absoluteCourantNumber"],
} as const;
/** Calculate one-axis signed and absolute Courant numbers without choosing a numerical scheme’s stability limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedSpeed, timeStep, cellWidth } = request;
  const compute = (): Output => {
    H.domain(timeStep >= 0, "timeStep");
    (H.domain(cellWidth > 0, "cellWidth"), cellWidth);
    return {
      signedCourantNumber: (signedSpeed * timeStep) / cellWidth,
      absoluteCourantNumber: (Math.abs(signedSpeed) * timeStep) / cellWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedSpeed: 2, timeStep: 0.1, cellWidth: 0.5 },
  output: { signedCourantNumber: 0.4, absoluteCourantNumber: 0.4 },
} satisfies ToolExample<Input, Output>;
export const courantNumberSingleAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/courant-number-single-axis",
    title: "Courant Number Single Axis",
    description:
      "Calculate one-axis signed and absolute Courant numbers without choosing a numerical scheme’s stability limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSpeed: { type: "number" },
        timeStep: { type: "number", minimum: 0 },
        cellWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["signedSpeed", "timeStep", "cellWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedCourantNumber: { type: "number" },
        absoluteCourantNumber: { type: "number" },
      },
      required: ["signedCourantNumber", "absoluteCourantNumber"],
    },
    ports: {
      inputs: [
        {
          id: "signedSpeed",
          label: "Signed Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedCourantNumber",
          label: "Signed Courant Number",
          valueType: { type: "number" },
        },
        {
          id: "absoluteCourantNumber",
          label: "Absolute Courant Number",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = courantNumberSingleAxisTool.execute;
export default courantNumberSingleAxisTool;
