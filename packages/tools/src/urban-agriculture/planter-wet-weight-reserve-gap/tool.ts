import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerMass: number;
  readonly dryContentsMass: number;
  readonly waterMass: number;
  readonly suppliedLimit: number;
};
export type Output = { readonly wetMass: number; readonly reserve: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerMass: { type: "number", minimum: 0 },
    dryContentsMass: { type: "number", minimum: 0 },
    waterMass: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["containerMass", "dryContentsMass", "waterMass", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wetMass: { type: "number" }, reserve: { type: "number" } },
  required: ["wetMass", "reserve"],
} as const;
/** Supplied planter mass ledger against an independent limit; does not assess roof structural capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerMass, dryContentsMass, waterMass, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(
      containerMass >= 0 &&
        dryContentsMass >= 0 &&
        waterMass >= 0 &&
        suppliedLimit >= 0,
    );
    return {
      wetMass: containerMass + dryContentsMass + waterMass,
      reserve: suppliedLimit - containerMass - dryContentsMass - waterMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerMass: 10,
    dryContentsMass: 50,
    waterMass: 20,
    suppliedLimit: 100,
  },
  output: { wetMass: 80, reserve: 20 },
} satisfies ToolExample<Input, Output>;
export const planterWetWeightReserveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/planter-wet-weight-reserve-gap",
    title: "Planter Wet Weight Reserve Gap Tool",
    description:
      "Supplied planter mass ledger against an independent limit; does not assess roof structural capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerMass: { type: "number", minimum: 0 },
        dryContentsMass: { type: "number", minimum: 0 },
        waterMass: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: [
        "containerMass",
        "dryContentsMass",
        "waterMass",
        "suppliedLimit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wetMass: { type: "number" }, reserve: { type: "number" } },
      required: ["wetMass", "reserve"],
    },
    ports: {
      inputs: [
        {
          id: "containerMass",
          label: "Container Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryContentsMass",
          label: "Dry Contents Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wetMass", label: "Wet Mass", valueType: { type: "number" } },
        { id: "reserve", label: "Reserve", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = planterWetWeightReserveGapTool.execute;
export default planterWetWeightReserveGapTool;
