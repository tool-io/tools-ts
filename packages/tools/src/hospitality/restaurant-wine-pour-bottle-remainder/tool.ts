import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottleVolume: number;
  readonly pourVolume: number;
  readonly lossVolume: number;
};
export type Output = { readonly pours: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottleVolume: { type: "number" },
    pourVolume: { type: "number", exclusiveMinimum: 0 },
    lossVolume: { type: "number", minimum: 0 },
  },
  required: ["bottleVolume", "pourVolume", "lossVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pours: { type: "integer" }, remainder: { type: "number" } },
  required: ["pours", "remainder"],
} as const;
/** Calculate restaurant wine pour bottle remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottleVolume, pourVolume, lossVolume } = request;
  const compute = (): Output => {
    H.positive(pourVolume);
    H.domain(lossVolume >= 0 && bottleVolume >= lossVolume);
    return {
      pours: Math.floor((bottleVolume - lossVolume) / pourVolume),
      remainder: (bottleVolume - lossVolume) % pourVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottleVolume: 750, pourVolume: 125, lossVolume: 25 },
  output: { pours: 5, remainder: 100 },
} satisfies ToolExample<Input, Output>;
export const restaurantWinePourBottleRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/restaurant-wine-pour-bottle-remainder",
    title: "Restaurant Wine Pour Bottle Remainder Tool",
    description:
      "Calculate restaurant wine pour bottle remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottleVolume: { type: "number" },
        pourVolume: { type: "number", exclusiveMinimum: 0 },
        lossVolume: { type: "number", minimum: 0 },
      },
      required: ["bottleVolume", "pourVolume", "lossVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pours: { type: "integer" }, remainder: { type: "number" } },
      required: ["pours", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "bottleVolume",
          label: "Bottle Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pourVolume",
          label: "Pour Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossVolume",
          label: "Loss Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "pours", label: "Pours", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = restaurantWinePourBottleRemainderTool.execute;
export default restaurantWinePourBottleRemainderTool;
