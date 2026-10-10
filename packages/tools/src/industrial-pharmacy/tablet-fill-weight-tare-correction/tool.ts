import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly tareMass: number;
  readonly tabletCount: number;
};
export type Output = {
  readonly netMass: number;
  readonly massPerTablet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number" },
    tareMass: { type: "number", minimum: 0 },
    tabletCount: { type: "integer", minimum: 1 },
  },
  required: ["grossMass", "tareMass", "tabletCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    massPerTablet: { type: "number" },
  },
  required: ["netMass", "massPerTablet"],
} as const;
/** Subtract explicit container tare and divide net mass by a supplied tablet count without assessing dose uniformity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, tareMass, tabletCount } = request;
  const compute = (): Output => {
    H.domain(grossMass >= tareMass && tareMass >= 0, "grossMass");
    (H.domain(
      Number.isSafeInteger(tabletCount) &&
        tabletCount >= 1 &&
        tabletCount <= Number.MAX_SAFE_INTEGER,
      "tabletCount",
    ),
      tabletCount);
    return {
      netMass: grossMass - tareMass,
      massPerTablet: (grossMass - tareMass) / tabletCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 150, tareMass: 30, tabletCount: 40 },
  output: { netMass: 120, massPerTablet: 3 },
} satisfies ToolExample<Input, Output>;
export const tabletFillWeightTareCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
      keywords: ["industrial pharmacy", "pharmacy"],
    },
    id: "industrial-pharmacy/tablet-fill-weight-tare-correction",
    title: "Tablet Fill Weight Tare Correction",
    description:
      "Subtract explicit container tare and divide net mass by a supplied tablet count without assessing dose uniformity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number" },
        tareMass: { type: "number", minimum: 0 },
        tabletCount: { type: "integer", minimum: 1 },
      },
      required: ["grossMass", "tareMass", "tabletCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        massPerTablet: { type: "number" },
      },
      required: ["netMass", "massPerTablet"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tabletCount",
          label: "Tablet Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "massPerTablet",
          label: "Mass Per Tablet",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tabletFillWeightTareCorrectionTool.execute;
export default tabletFillWeightTareCorrectionTool;
