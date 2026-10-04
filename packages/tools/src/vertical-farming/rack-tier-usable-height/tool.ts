import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tierPitch: number;
  readonly fixtureDepth: number;
  readonly trayDepth: number;
  readonly suppliedClearanceReserve: number;
};
export type Output = {
  readonly nominalSpace: number;
  readonly usableHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tierPitch: { type: "number" },
    fixtureDepth: { type: "number" },
    trayDepth: { type: "number" },
    suppliedClearanceReserve: { type: "number" },
  },
  required: [
    "tierPitch",
    "fixtureDepth",
    "trayDepth",
    "suppliedClearanceReserve",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalSpace: { type: "number" },
    usableHeight: { type: "number" },
  },
  required: ["nominalSpace", "usableHeight"],
} as const;
/** Supplied nominal rack geometry without crop suitability or structural design advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tierPitch, fixtureDepth, trayDepth, suppliedClearanceReserve } =
    request;
  const compute = (): Output => {
    H.domain(
      [tierPitch, fixtureDepth, trayDepth, suppliedClearanceReserve].every(
        (x) => x >= 0,
      ),
    );
    return {
      nominalSpace: tierPitch - fixtureDepth - trayDepth,
      usableHeight:
        tierPitch - fixtureDepth - trayDepth - suppliedClearanceReserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tierPitch: 100,
    fixtureDepth: 10,
    trayDepth: 20,
    suppliedClearanceReserve: 5,
  },
  output: { nominalSpace: 70, usableHeight: 65 },
} satisfies ToolExample<Input, Output>;
export const rackTierUsableHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/rack-tier-usable-height",
    title: "Rack Tier Usable Height Tool",
    description:
      "Supplied nominal rack geometry without crop suitability or structural design advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tierPitch: { type: "number" },
        fixtureDepth: { type: "number" },
        trayDepth: { type: "number" },
        suppliedClearanceReserve: { type: "number" },
      },
      required: [
        "tierPitch",
        "fixtureDepth",
        "trayDepth",
        "suppliedClearanceReserve",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalSpace: { type: "number" },
        usableHeight: { type: "number" },
      },
      required: ["nominalSpace", "usableHeight"],
    },
    ports: {
      inputs: [
        {
          id: "tierPitch",
          label: "Tier Pitch",
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
          id: "trayDepth",
          label: "Tray Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClearanceReserve",
          label: "Supplied Clearance Reserve",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalSpace",
          label: "Nominal Space",
          valueType: { type: "number" },
        },
        {
          id: "usableHeight",
          label: "Usable Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rackTierUsableHeightTool.execute;
export default rackTierUsableHeightTool;
