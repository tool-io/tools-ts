import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rackHeight: number;
  readonly hangerDrop: number;
  readonly fixtureDepth: number;
  readonly trayHeight: number;
  readonly referenceClearance: number;
};
export type Output = {
  readonly clearance: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rackHeight: { type: "number", minimum: 0 },
    hangerDrop: { type: "number", minimum: 0 },
    fixtureDepth: { type: "number", minimum: 0 },
    trayHeight: { type: "number", minimum: 0 },
    referenceClearance: { type: "number", minimum: 0 },
  },
  required: [
    "rackHeight",
    "hangerDrop",
    "fixtureDepth",
    "trayHeight",
    "referenceClearance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearance: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["clearance", "referenceGap"],
} as const;
/** Nominal supplied vertical clearance ledger, without selecting crop lighting or structural limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rackHeight,
    hangerDrop,
    fixtureDepth,
    trayHeight,
    referenceClearance,
  } = request;
  const compute = (): Output => {
    H.domain(
      rackHeight >= 0 &&
        hangerDrop >= 0 &&
        fixtureDepth >= 0 &&
        trayHeight >= 0 &&
        referenceClearance >= 0,
    );
    return {
      clearance: rackHeight - hangerDrop - fixtureDepth - trayHeight,
      referenceGap:
        rackHeight -
        hangerDrop -
        fixtureDepth -
        trayHeight -
        referenceClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rackHeight: 200,
    hangerDrop: 20,
    fixtureDepth: 10,
    trayHeight: 100,
    referenceClearance: 60,
  },
  output: { clearance: 70, referenceGap: 10 },
} satisfies ToolExample<Input, Output>;
export const growRackFixtureHangerAdjustmentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/grow-rack-fixture-hanger-adjustment-gap",
    title: "Grow Rack Fixture Hanger Adjustment Gap Tool",
    description:
      "Nominal supplied vertical clearance ledger, without selecting crop lighting or structural limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rackHeight: { type: "number", minimum: 0 },
        hangerDrop: { type: "number", minimum: 0 },
        fixtureDepth: { type: "number", minimum: 0 },
        trayHeight: { type: "number", minimum: 0 },
        referenceClearance: { type: "number", minimum: 0 },
      },
      required: [
        "rackHeight",
        "hangerDrop",
        "fixtureDepth",
        "trayHeight",
        "referenceClearance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearance: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["clearance", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "rackHeight",
          label: "Rack Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hangerDrop",
          label: "Hanger Drop",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixtureDepth",
          label: "Fixture Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trayHeight",
          label: "Tray Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceClearance",
          label: "Reference Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growRackFixtureHangerAdjustmentGapTool.execute;
export default growRackFixtureHangerAdjustmentGapTool;
