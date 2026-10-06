import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holeDiameter: number;
  readonly pinDiameter: number;
};
export type Output = {
  readonly diametralClearance: number;
  readonly radialClearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holeDiameter: { type: "number", minimum: 0 },
    pinDiameter: { type: "number", minimum: 0 },
  },
  required: ["holeDiameter", "pinDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diametralClearance: { type: "number" },
    radialClearance: { type: "number" },
  },
  required: ["diametralClearance", "radialClearance"],
} as const;
/** Subtract explicit pin and hole diameters, preserving interference as negative clearance without judging mechanical fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holeDiameter, pinDiameter } = request;
  const compute = (): Output => {
    H.domain(holeDiameter >= 0 && pinDiameter >= 0, "holeDiameter");
    return {
      diametralClearance: holeDiameter - pinDiameter,
      radialClearance: (holeDiameter - pinDiameter) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holeDiameter: 22, pinDiameter: 20 },
  output: { diametralClearance: 2, radialClearance: 1 },
} satisfies ToolExample<Input, Output>;
export const implementPinHoleClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/implement-pin-hole-clearance",
    title: "Implement Pin Hole Clearance",
    description:
      "Subtract explicit pin and hole diameters, preserving interference as negative clearance without judging mechanical fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holeDiameter: { type: "number", minimum: 0 },
        pinDiameter: { type: "number", minimum: 0 },
      },
      required: ["holeDiameter", "pinDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diametralClearance: { type: "number" },
        radialClearance: { type: "number" },
      },
      required: ["diametralClearance", "radialClearance"],
    },
    ports: {
      inputs: [
        {
          id: "holeDiameter",
          label: "Hole Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pinDiameter",
          label: "Pin Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diametralClearance",
          label: "Diametral Clearance",
          valueType: { type: "number" },
        },
        {
          id: "radialClearance",
          label: "Radial Clearance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementPinHoleClearanceTool.execute;
export default implementPinHoleClearanceTool;
