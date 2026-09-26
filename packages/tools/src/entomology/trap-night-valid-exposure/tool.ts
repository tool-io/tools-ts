import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly validNights: readonly number[];
  readonly traps: readonly number[];
};
export type Output = { readonly trapNights: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validNights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    traps: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["validNights", "traps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { trapNights: { type: "number" } },
  required: ["trapNights"],
} as const;
/** Calculate trap night valid exposure from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validNights, traps } = request;
  const compute = (): Output => {
    H.domain(validNights.every((x) => x >= 0) && traps.every((x) => x >= 0));
    return { trapNights: H.dot(validNights, traps) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { validNights: [2, 3], traps: [4, 2] },
  output: { trapNights: 14 },
} satisfies ToolExample<Input, Output>;
export const trapNightValidExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/trap-night-valid-exposure",
    title: "Trap Night Valid Exposure Tool",
    description:
      "Calculate trap night valid exposure from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validNights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        traps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["validNights", "traps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { trapNights: { type: "number" } },
      required: ["trapNights"],
    },
    ports: {
      inputs: [
        {
          id: "validNights",
          label: "Valid Nights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "traps",
          label: "Traps",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "trapNights",
          label: "Trap Nights",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trapNightValidExposureTool.execute;
export default trapNightValidExposureTool;
