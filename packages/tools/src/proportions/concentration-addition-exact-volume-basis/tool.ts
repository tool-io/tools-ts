import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAmount: number;
  readonly firstConcentration: number;
  readonly secondAmount: number;
  readonly secondConcentration: number;
  readonly finalVolume: number;
};
export type Output = { readonly concentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAmount: { type: "number", minimum: 0 },
    firstConcentration: { type: "number", minimum: 0 },
    secondAmount: { type: "number", minimum: 0 },
    secondConcentration: { type: "number", minimum: 0 },
    finalVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstAmount",
    "firstConcentration",
    "secondAmount",
    "secondConcentration",
    "finalVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { concentration: { type: "number" } },
  required: ["concentration"],
} as const;
/** Use an explicitly measured final volume rather than assuming additive component volumes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstAmount,
    firstConcentration,
    secondAmount,
    secondConcentration,
    finalVolume,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstAmount >= 0 &&
        secondAmount >= 0 &&
        firstConcentration >= 0 &&
        secondConcentration >= 0,
    );
    H.positive(finalVolume);
    return {
      concentration:
        (firstAmount * firstConcentration +
          secondAmount * secondConcentration) /
        finalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAmount: 20,
    firstConcentration: 2,
    secondAmount: 30,
    secondConcentration: 4,
    finalVolume: 40,
  },
  output: { concentration: 4 },
} satisfies ToolExample<Input, Output>;
export const concentrationAdditionExactVolumeBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/concentration-addition-exact-volume-basis",
      title: "Concentration Addition Exact Volume Basis Tool",
      description:
        "Use an explicitly measured final volume rather than assuming additive component volumes.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstAmount: { type: "number", minimum: 0 },
          firstConcentration: { type: "number", minimum: 0 },
          secondAmount: { type: "number", minimum: 0 },
          secondConcentration: { type: "number", minimum: 0 },
          finalVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstAmount",
          "firstConcentration",
          "secondAmount",
          "secondConcentration",
          "finalVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { concentration: { type: "number" } },
        required: ["concentration"],
      },
      ports: {
        inputs: [
          {
            id: "firstAmount",
            label: "First Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstConcentration",
            label: "First Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondAmount",
            label: "Second Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondConcentration",
            label: "Second Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = concentrationAdditionExactVolumeBasisTool.execute;
export default concentrationAdditionExactVolumeBasisTool;
