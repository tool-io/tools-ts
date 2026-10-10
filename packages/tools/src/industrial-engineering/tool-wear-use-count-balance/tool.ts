import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingUses: number;
  readonly addedUses: number;
  readonly suppliedUseLimit: number;
};
export type Output = {
  readonly totalUses: number;
  readonly remainingUses: number;
  readonly exceedsLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingUses: { type: "integer", minimum: 0 },
    addedUses: { type: "integer", minimum: 0 },
    suppliedUseLimit: { type: "integer", minimum: 0 },
  },
  required: ["openingUses", "addedUses", "suppliedUseLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalUses: { type: "integer" },
    remainingUses: { type: "integer" },
    exceedsLimit: { type: "boolean" },
  },
  required: ["totalUses", "remainingUses", "exceedsLimit"],
} as const;
/** Compare an explicit cumulative tool-use count with a supplied limit without estimating wear or replacement safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingUses, addedUses, suppliedUseLimit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingUses) &&
        openingUses >= 0 &&
        openingUses <= Number.MAX_SAFE_INTEGER,
      "openingUses",
    ),
      openingUses);
    (H.domain(
      Number.isSafeInteger(addedUses) &&
        addedUses >= 0 &&
        addedUses <= Number.MAX_SAFE_INTEGER,
      "addedUses",
    ),
      addedUses);
    (H.domain(
      Number.isSafeInteger(suppliedUseLimit) &&
        suppliedUseLimit >= 0 &&
        suppliedUseLimit <= Number.MAX_SAFE_INTEGER,
      "suppliedUseLimit",
    ),
      suppliedUseLimit);
    return {
      totalUses: openingUses + addedUses,
      remainingUses: suppliedUseLimit - openingUses - addedUses,
      exceedsLimit: openingUses + addedUses > suppliedUseLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingUses: 80, addedUses: 15, suppliedUseLimit: 100 },
  output: { totalUses: 95, remainingUses: 5, exceedsLimit: false },
} satisfies ToolExample<Input, Output>;
export const toolWearUseCountBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/tool-wear-use-count-balance",
    title: "Tool Wear Use Count Balance",
    description:
      "Compare an explicit cumulative tool-use count with a supplied limit without estimating wear or replacement safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingUses: { type: "integer", minimum: 0 },
        addedUses: { type: "integer", minimum: 0 },
        suppliedUseLimit: { type: "integer", minimum: 0 },
      },
      required: ["openingUses", "addedUses", "suppliedUseLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalUses: { type: "integer" },
        remainingUses: { type: "integer" },
        exceedsLimit: { type: "boolean" },
      },
      required: ["totalUses", "remainingUses", "exceedsLimit"],
    },
    ports: {
      inputs: [
        {
          id: "openingUses",
          label: "Opening Uses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedUses",
          label: "Added Uses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedUseLimit",
          label: "Supplied Use Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalUses",
          label: "Total Uses",
          valueType: { type: "integer" },
        },
        {
          id: "remainingUses",
          label: "Remaining Uses",
          valueType: { type: "integer" },
        },
        {
          id: "exceedsLimit",
          label: "Exceeds Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = toolWearUseCountBalanceTool.execute;
export default toolWearUseCountBalanceTool;
