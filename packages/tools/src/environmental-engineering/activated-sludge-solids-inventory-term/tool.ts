import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aerationVolume: number;
  readonly aerationSolids: number;
  readonly clarifierVolume: number;
  readonly clarifierSolids: number;
  readonly wastedMassPerDay: number;
  readonly effluentMassPerDay: number;
};
export type Output = {
  readonly inventory: number;
  readonly solidsRetentionDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aerationVolume: { type: "number", minimum: 0 },
    aerationSolids: { type: "number", minimum: 0 },
    clarifierVolume: { type: "number", minimum: 0 },
    clarifierSolids: { type: "number", minimum: 0 },
    wastedMassPerDay: { type: "number", minimum: 0 },
    effluentMassPerDay: { type: "number", minimum: 0 },
  },
  required: [
    "aerationVolume",
    "aerationSolids",
    "clarifierVolume",
    "clarifierSolids",
    "wastedMassPerDay",
    "effluentMassPerDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inventory: { type: "number" },
    solidsRetentionDays: { type: "number" },
  },
  required: ["inventory", "solidsRetentionDays"],
} as const;
/** Calculate activated sludge solids inventory term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    aerationVolume,
    aerationSolids,
    clarifierVolume,
    clarifierSolids,
    wastedMassPerDay,
    effluentMassPerDay,
  } = request;
  const compute = (): Output => {
    H.domain(
      aerationVolume >= 0 &&
        aerationSolids >= 0 &&
        clarifierVolume >= 0 &&
        clarifierSolids >= 0 &&
        wastedMassPerDay >= 0 &&
        effluentMassPerDay >= 0 &&
        wastedMassPerDay + effluentMassPerDay > 0,
    );
    return {
      inventory:
        aerationVolume * aerationSolids + clarifierVolume * clarifierSolids,
      solidsRetentionDays:
        (aerationVolume * aerationSolids + clarifierVolume * clarifierSolids) /
        (wastedMassPerDay + effluentMassPerDay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    aerationVolume: 100,
    aerationSolids: 3,
    clarifierVolume: 20,
    clarifierSolids: 5,
    wastedMassPerDay: 30,
    effluentMassPerDay: 10,
  },
  output: { inventory: 400, solidsRetentionDays: 10 },
} satisfies ToolExample<Input, Output>;
export const activatedSludgeSolidsInventoryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/activated-sludge-solids-inventory-term",
    title: "Activated Sludge Solids Inventory Term Tool",
    description:
      "Calculate activated sludge solids inventory term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aerationVolume: { type: "number", minimum: 0 },
        aerationSolids: { type: "number", minimum: 0 },
        clarifierVolume: { type: "number", minimum: 0 },
        clarifierSolids: { type: "number", minimum: 0 },
        wastedMassPerDay: { type: "number", minimum: 0 },
        effluentMassPerDay: { type: "number", minimum: 0 },
      },
      required: [
        "aerationVolume",
        "aerationSolids",
        "clarifierVolume",
        "clarifierSolids",
        "wastedMassPerDay",
        "effluentMassPerDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inventory: { type: "number" },
        solidsRetentionDays: { type: "number" },
      },
      required: ["inventory", "solidsRetentionDays"],
    },
    ports: {
      inputs: [
        {
          id: "aerationVolume",
          label: "Aeration Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aerationSolids",
          label: "Aeration Solids",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clarifierVolume",
          label: "Clarifier Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clarifierSolids",
          label: "Clarifier Solids",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wastedMassPerDay",
          label: "Wasted Mass Per Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effluentMassPerDay",
          label: "Effluent Mass Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inventory", label: "Inventory", valueType: { type: "number" } },
        {
          id: "solidsRetentionDays",
          label: "Solids Retention Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activatedSludgeSolidsInventoryTermTool.execute;
export default activatedSludgeSolidsInventoryTermTool;
