import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ph: number;
  readonly pka: number;
  readonly groupCount: number;
  readonly acidic: boolean;
};
export type Output = {
  readonly ionizedFraction: number;
  readonly charge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ph: { type: "number" },
    pka: { type: "number" },
    groupCount: { type: "integer", minimum: 0 },
    acidic: { type: "boolean" },
  },
  required: ["ph", "pka", "groupCount", "acidic"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ionizedFraction: { type: "number" },
    charge: { type: "number" },
  },
  required: ["ionizedFraction", "charge"],
} as const;
/** One ideal monoprotic group type with charges -1 for dissociated acid and +1 for protonated base; not whole-protein pI. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ph, pka, groupCount, acidic } = request;
  const compute = (): Output => {
    H.integer(groupCount, 0);
    return {
      ionizedFraction: acidic
        ? 1 / (1 + 10 ** (pka - ph))
        : 1 / (1 + 10 ** (ph - pka)),
      charge:
        ((acidic ? -1 : 1) * groupCount) /
        (1 + (acidic ? 10 ** (pka - ph) : 10 ** (ph - pka))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ph: 7, pka: 7, groupCount: 4, acidic: true },
  output: { ionizedFraction: 0.5, charge: -2 },
} satisfies ToolExample<Input, Output>;
export const proteinNetChargeOneGroupTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/protein-net-charge-one-group-term",
    title: "Protein Net Charge One Group Term Tool",
    description:
      "One ideal monoprotic group type with charges -1 for dissociated acid and +1 for protonated base; not whole-protein pI.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ph: { type: "number" },
        pka: { type: "number" },
        groupCount: { type: "integer", minimum: 0 },
        acidic: { type: "boolean" },
      },
      required: ["ph", "pka", "groupCount", "acidic"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ionizedFraction: { type: "number" },
        charge: { type: "number" },
      },
      required: ["ionizedFraction", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "ph",
          label: "Ph",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pka",
          label: "Pka",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groupCount",
          label: "Group Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "acidic",
          label: "Acidic",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "ionizedFraction",
          label: "Ionized Fraction",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proteinNetChargeOneGroupTermTool.execute;
export default proteinNetChargeOneGroupTermTool;
