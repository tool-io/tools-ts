import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthEventId: string;
  readonly oneBasedInfantOrder: number;
};
export type Output = { readonly identifier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthEventId: { type: "string", maxLength: 8192, minLength: 1 },
    oneBasedInfantOrder: { type: "integer", minimum: 1 },
  },
  required: ["birthEventId", "oneBasedInfantOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
/** Qualify an explicitly recorded infant birth-order ordinal by a birth-event identifier without identity matching. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthEventId, oneBasedInfantOrder } = request;
  const compute = (): Output => {
    H.domain(birthEventId.length > 0, "birthEventId");
    (H.domain(
      Number.isSafeInteger(oneBasedInfantOrder) &&
        oneBasedInfantOrder >= 1 &&
        oneBasedInfantOrder <= Number.MAX_SAFE_INTEGER,
      "oneBasedInfantOrder",
    ),
      oneBasedInfantOrder);
    return { identifier: JSON.stringify([birthEventId, oneBasedInfantOrder]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthEventId: "BE17", oneBasedInfantOrder: 2 },
  output: { identifier: '["BE17",2]' },
} satisfies ToolExample<Input, Output>;
export const neonatalBirthOrderIdentifierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-birth-order-identifier",
    title: "Neonatal Birth Order Identifier",
    description:
      "Qualify an explicitly recorded infant birth-order ordinal by a birth-event identifier without identity matching.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthEventId: { type: "string", maxLength: 8192, minLength: 1 },
        oneBasedInfantOrder: { type: "integer", minimum: 1 },
      },
      required: ["birthEventId", "oneBasedInfantOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    ports: {
      inputs: [
        {
          id: "birthEventId",
          label: "Birth Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedInfantOrder",
          label: "One Based Infant Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "identifier",
          label: "Identifier",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = neonatalBirthOrderIdentifierTool.execute;
export default neonatalBirthOrderIdentifierTool;
