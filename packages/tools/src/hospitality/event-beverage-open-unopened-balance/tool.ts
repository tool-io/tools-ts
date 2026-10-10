import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingOpen: number;
  readonly openingUnopened: number;
  readonly newlyOpened: number;
  readonly consumed: number;
};
export type Output = {
  readonly remainingOpen: number;
  readonly remainingUnopened: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingOpen: { type: "integer", minimum: 0 },
    openingUnopened: { type: "integer", minimum: 0 },
    newlyOpened: { type: "integer", minimum: 0 },
    consumed: { type: "integer", minimum: 0 },
  },
  required: ["openingOpen", "openingUnopened", "newlyOpened", "consumed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingOpen: { type: "integer" },
    remainingUnopened: { type: "integer" },
  },
  required: ["remainingOpen", "remainingUnopened"],
} as const;
/** Reconcile explicit open and unopened beverage container counts after opening and consumption movements without inferring partial-container volumes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingOpen, openingUnopened, newlyOpened, consumed } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingOpen) &&
        openingOpen >= 0 &&
        openingOpen <= Number.MAX_SAFE_INTEGER,
      "openingOpen",
    ),
      openingOpen);
    (H.domain(
      Number.isSafeInteger(openingUnopened) &&
        openingUnopened >= 0 &&
        openingUnopened <= Number.MAX_SAFE_INTEGER,
      "openingUnopened",
    ),
      openingUnopened);
    (H.domain(
      Number.isSafeInteger(newlyOpened) &&
        newlyOpened >= 0 &&
        newlyOpened <= openingUnopened,
      "newlyOpened",
    ),
      newlyOpened);
    (H.domain(
      Number.isSafeInteger(consumed) &&
        consumed >= 0 &&
        consumed <= Number.MAX_SAFE_INTEGER,
      "consumed",
    ),
      consumed);
    return {
      remainingOpen: Number(
        BigInt(openingOpen) + BigInt(newlyOpened) - BigInt(consumed),
      ),
      remainingUnopened: openingUnopened - newlyOpened,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingOpen: 5, openingUnopened: 20, newlyOpened: 8, consumed: 10 },
  output: { remainingOpen: 3, remainingUnopened: 12 },
} satisfies ToolExample<Input, Output>;
export const eventBeverageOpenUnopenedBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/event-beverage-open-unopened-balance",
    title: "Event Beverage Open Unopened Balance",
    description:
      "Reconcile explicit open and unopened beverage container counts after opening and consumption movements without inferring partial-container volumes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingOpen: { type: "integer", minimum: 0 },
        openingUnopened: { type: "integer", minimum: 0 },
        newlyOpened: { type: "integer", minimum: 0 },
        consumed: { type: "integer", minimum: 0 },
      },
      required: ["openingOpen", "openingUnopened", "newlyOpened", "consumed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingOpen: { type: "integer" },
        remainingUnopened: { type: "integer" },
      },
      required: ["remainingOpen", "remainingUnopened"],
    },
    ports: {
      inputs: [
        {
          id: "openingOpen",
          label: "Opening Open",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "openingUnopened",
          label: "Opening Unopened",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newlyOpened",
          label: "Newly Opened",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "consumed",
          label: "Consumed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingOpen",
          label: "Remaining Open",
          valueType: { type: "integer" },
        },
        {
          id: "remainingUnopened",
          label: "Remaining Unopened",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = eventBeverageOpenUnopenedBalanceTool.execute;
export default eventBeverageOpenUnopenedBalanceTool;
