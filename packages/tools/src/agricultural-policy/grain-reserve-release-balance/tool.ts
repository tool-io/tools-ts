import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMass: number;
  readonly receivedMass: number;
  readonly releasedMass: number;
};
export type Output = { readonly closingMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMass: { type: "number", minimum: 0 },
    receivedMass: { type: "number", minimum: 0 },
    releasedMass: { type: "number", minimum: 0 },
  },
  required: ["openingMass", "receivedMass", "releasedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingMass: { type: "number" } },
  required: ["closingMass"],
} as const;
/** Reconcile explicit compatible grain-reserve masses while preserving a signed shortfall. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMass, receivedMass, releasedMass } = request;
  const compute = (): Output => {
    H.domain(
      openingMass >= 0 && receivedMass >= 0 && releasedMass >= 0,
      "openingMass",
    );
    return { closingMass: openingMass + receivedMass - releasedMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingMass: 1000, receivedMass: 200, releasedMass: 350 },
  output: { closingMass: 850 },
} satisfies ToolExample<Input, Output>;
export const grainReserveReleaseBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/grain-reserve-release-balance",
    title: "Grain Reserve Release Balance",
    description:
      "Reconcile explicit compatible grain-reserve masses while preserving a signed shortfall.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMass: { type: "number", minimum: 0 },
        receivedMass: { type: "number", minimum: 0 },
        releasedMass: { type: "number", minimum: 0 },
      },
      required: ["openingMass", "receivedMass", "releasedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingMass: { type: "number" } },
      required: ["closingMass"],
    },
    ports: {
      inputs: [
        {
          id: "openingMass",
          label: "Opening Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedMass",
          label: "Received Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releasedMass",
          label: "Released Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingMass",
          label: "Closing Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grainReserveReleaseBalanceTool.execute;
export default grainReserveReleaseBalanceTool;
