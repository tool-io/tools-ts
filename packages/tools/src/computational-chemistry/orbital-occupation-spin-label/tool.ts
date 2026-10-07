import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orbitalId: string;
  readonly alphaOccupation: number;
  readonly betaOccupation: number;
};
export type Output = {
  readonly label: string;
  readonly totalOccupation: number;
  readonly spinImbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orbitalId: { type: "string", maxLength: 8192, minLength: 1 },
    alphaOccupation: { type: "number", minimum: 0, maximum: 1 },
    betaOccupation: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["orbitalId", "alphaOccupation", "betaOccupation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    totalOccupation: { type: "number" },
    spinImbalance: { type: "number" },
  },
  required: ["label", "totalOccupation", "spinImbalance"],
} as const;
/** Label explicit spin-resolved orbital occupations, allowing fractional occupations without inferring an electronic state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orbitalId, alphaOccupation, betaOccupation } = request;
  const compute = (): Output => {
    H.domain(orbitalId.length > 0, "orbitalId");
    (H.domain(alphaOccupation >= 0 && alphaOccupation <= 1, "alphaOccupation"),
      alphaOccupation);
    (H.domain(betaOccupation >= 0 && betaOccupation <= 1, "betaOccupation"),
      betaOccupation);
    return {
      label:
        orbitalId + "; alpha=" + alphaOccupation + "; beta=" + betaOccupation,
      totalOccupation: alphaOccupation + betaOccupation,
      spinImbalance: alphaOccupation - betaOccupation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orbitalId: "MO7", alphaOccupation: 1, betaOccupation: 0 },
  output: {
    label: "MO7; alpha=1; beta=0",
    totalOccupation: 1,
    spinImbalance: 1,
  },
} satisfies ToolExample<Input, Output>;
export const orbitalOccupationSpinLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/orbital-occupation-spin-label",
    title: "Orbital Occupation Spin Label",
    description:
      "Label explicit spin-resolved orbital occupations, allowing fractional occupations without inferring an electronic state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orbitalId: { type: "string", maxLength: 8192, minLength: 1 },
        alphaOccupation: { type: "number", minimum: 0, maximum: 1 },
        betaOccupation: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["orbitalId", "alphaOccupation", "betaOccupation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        totalOccupation: { type: "number" },
        spinImbalance: { type: "number" },
      },
      required: ["label", "totalOccupation", "spinImbalance"],
    },
    ports: {
      inputs: [
        {
          id: "orbitalId",
          label: "Orbital Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alphaOccupation",
          label: "Alpha Occupation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "betaOccupation",
          label: "Beta Occupation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "totalOccupation",
          label: "Total Occupation",
          valueType: { type: "number" },
        },
        {
          id: "spinImbalance",
          label: "Spin Imbalance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orbitalOccupationSpinLabelTool.execute;
export default orbitalOccupationSpinLabelTool;
