import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly outletOpen: readonly boolean[];
  readonly affordableUnderSuppliedRule: readonly boolean[];
  readonly transportAvailable: readonly boolean[];
};
export type Output = {
  readonly openDuration: number;
  readonly accessibleDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    outletOpen: { type: "array", maxItems: 256, items: { type: "boolean" } },
    affordableUnderSuppliedRule: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    transportAvailable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "durations",
    "outletOpen",
    "affordableUnderSuppliedRule",
    "transportAvailable",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openDuration: { type: "number" },
    accessibleDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["openDuration", "accessibleDuration", "share", "defined"],
} as const;
/** Calculate food access window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    durations,
    outletOpen,
    affordableUnderSuppliedRule,
    transportAvailable,
  } = request;
  const compute = (): Output => {
    H.sameLength(durations, outletOpen);
    H.sameLength(durations, affordableUnderSuppliedRule);
    H.sameLength(durations, transportAvailable);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const openDuration = durations.reduce(
          (s, x, i) => s + (outletOpen[i] ? x : 0),
          0,
        ),
        accessibleDuration = durations.reduce(
          (s, x, i) =>
            s +
            (outletOpen[i] &&
            affordableUnderSuppliedRule[i] &&
            transportAvailable[i]
              ? x
              : 0),
          0,
        );
      return {
        openDuration,
        accessibleDuration,
        share: openDuration > 0 ? accessibleDuration / openDuration : 0,
        defined: openDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    outletOpen: [true, true, false],
    affordableUnderSuppliedRule: [true, true, true],
    transportAvailable: [true, false, true],
  },
  output: { openDuration: 5, accessibleDuration: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const foodAccessWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-access-window-share",
    title: "Food Access Window Share Tool",
    description:
      "Calculate food access window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        outletOpen: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        affordableUnderSuppliedRule: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        transportAvailable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "durations",
        "outletOpen",
        "affordableUnderSuppliedRule",
        "transportAvailable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openDuration: { type: "number" },
        accessibleDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["openDuration", "accessibleDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "outletOpen",
          label: "Outlet Open",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "affordableUnderSuppliedRule",
          label: "Affordable Under Supplied Rule",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "transportAvailable",
          label: "Transport Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "openDuration",
          label: "Open Duration",
          valueType: { type: "number" },
        },
        {
          id: "accessibleDuration",
          label: "Accessible Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = foodAccessWindowShareTool.execute;
export default foodAccessWindowShareTool;
