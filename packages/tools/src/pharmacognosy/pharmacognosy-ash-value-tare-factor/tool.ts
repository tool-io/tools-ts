import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crucibleMass: number;
  readonly crucibleAshMass: number;
  readonly sampleMass: number;
  readonly moistureFraction: number;
};
export type Output = {
  readonly ashMass: number;
  readonly asReceivedFraction: number;
  readonly dryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crucibleMass: { type: "number", minimum: 0 },
    crucibleAshMass: { type: "number" },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
    moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: [
    "crucibleMass",
    "crucibleAshMass",
    "sampleMass",
    "moistureFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ashMass: { type: "number" },
    asReceivedFraction: { type: "number" },
    dryFraction: { type: "number" },
  },
  required: ["ashMass", "asReceivedFraction", "dryFraction"],
} as const;
/** Calculate pharmacognosy ash value tare factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crucibleMass, crucibleAshMass, sampleMass, moistureFraction } =
    request;
  const compute = (): Output => {
    H.positive(sampleMass);
    H.domain(
      crucibleMass >= 0 &&
        crucibleAshMass >= crucibleMass &&
        moistureFraction >= 0 &&
        moistureFraction < 1,
    );
    return {
      ashMass: crucibleAshMass - crucibleMass,
      asReceivedFraction: (crucibleAshMass - crucibleMass) / sampleMass,
      dryFraction:
        (crucibleAshMass - crucibleMass) /
        (sampleMass * (1 - moistureFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    crucibleMass: 20,
    crucibleAshMass: 20.1,
    sampleMass: 5,
    moistureFraction: 0.2,
  },
  output: {
    ashMass: 0.10000000000000142,
    asReceivedFraction: 0.020000000000000285,
    dryFraction: 0.025000000000000355,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacognosyAshValueTareFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/pharmacognosy-ash-value-tare-factor",
    title: "Pharmacognosy Ash Value Tare Factor Tool",
    description:
      "Calculate pharmacognosy ash value tare factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crucibleMass: { type: "number", minimum: 0 },
        crucibleAshMass: { type: "number" },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
        moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: [
        "crucibleMass",
        "crucibleAshMass",
        "sampleMass",
        "moistureFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ashMass: { type: "number" },
        asReceivedFraction: { type: "number" },
        dryFraction: { type: "number" },
      },
      required: ["ashMass", "asReceivedFraction", "dryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "crucibleMass",
          label: "Crucible Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crucibleAshMass",
          label: "Crucible Ash Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ashMass", label: "Ash Mass", valueType: { type: "number" } },
        {
          id: "asReceivedFraction",
          label: "As Received Fraction",
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacognosyAshValueTareFactorTool.execute;
export default pharmacognosyAshValueTareFactorTool;
