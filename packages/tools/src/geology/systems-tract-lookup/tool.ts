import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SystemsTractLookupInput = {
  readonly systemsTract: string;
};

export type SystemsTractLookupOutput = {
  readonly cyclePosition: string;
  readonly baseLevelTrend: string;
  readonly boundingSurfaces: string;
  readonly description: string;
};

const TRACTS: Record<
  string,
  {
    cyclePosition: string;
    baseLevelTrend: string;
    boundingSurfaces: string;
    description: string;
  }
> = {
  "lowstand-fan": {
    cyclePosition: "early lowstand",
    baseLevelTrend: "falling to stillstand",
    boundingSurfaces:
      "base: sequence boundary; top: maximum flooding surface (downlap surface of the fan).",
    description:
      "Basin-floor and slope fans deposited during and immediately after forced regression; sand-rich gravity flows bypass the shelf.",
  },
  "lowstand-wedge": {
    cyclePosition: "late lowstand",
    baseLevelTrend: "stillstand to slow rise",
    boundingSurfaces:
      "base: sequence boundary or top of lowstand fan; top: transgressive surface.",
    description:
      "Progradational to aggradational wedge onlapping the slope as relative sea level begins to rise again.",
  },
  transgressive: {
    cyclePosition: "transgressive",
    baseLevelTrend: "rapid rise",
    boundingSurfaces:
      "base: transgressive surface; top: maximum flooding surface.",
    description:
      "Retrogradational parasequence set deposited as accommodation outpaces supply; often condensed and starved at the top.",
  },
  highstand: {
    cyclePosition: "highstand",
    baseLevelTrend: "slow rise then stillstand",
    boundingSurfaces: "base: maximum flooding surface; top: sequence boundary.",
    description:
      "Aggradational to progradational parasequence set deposited when supply outpaces slowing accommodation.",
  },
  "shelf-margin": {
    cyclePosition: "latest lowstand",
    baseLevelTrend: "slow rise",
    boundingSurfaces:
      "base: sequence boundary (type II) or shelf-margin systems tract boundary; top: transgressive surface.",
    description:
      "Weakly progradational to aggradational tract accreted at the shelf edge during mild falls and slow rises.",
  },
  "falling-stage": {
    cyclePosition: "forced regressive",
    baseLevelTrend: "falling",
    boundingSurfaces:
      "base: basal surface of forced regression; top: sequence boundary or correlative conformity.",
    description:
      "Progradational to downstepping deposits formed during relative sea-level fall, commonly with incised valleys feeding them.",
  },
};

export const calculateSystemsTractLookup = (
  input: SystemsTractLookupInput,
): SystemsTractLookupOutput => {
  const entry = TRACTS[input.systemsTract];
  if (entry === undefined)
    simpleError(
      "systemsTract",
      "Unknown systems tract; pick one from the supported list.",
      "unknown_tract",
    );
  return {
    cyclePosition: entry.cyclePosition,
    baseLevelTrend: entry.baseLevelTrend,
    boundingSurfaces: entry.boundingSurfaces,
    description: entry.description,
  };
};

export const systemsTractLookupExample = {
  input: { systemsTract: "highstand" },
  output: {
    cyclePosition: "highstand",
    baseLevelTrend: "slow rise then stillstand",
    boundingSurfaces: "base: maximum flooding surface; top: sequence boundary.",
    description:
      "Aggradational to progradational parasequence set deposited when supply outpaces slowing accommodation.",
  },
} satisfies ToolExample<SystemsTractLookupInput, SystemsTractLookupOutput>;

export const systemsTractLookupTool = createSimpleTool({
  id: "geology/systems-tract-lookup",
  title: "Systems Tract Lookup",
  description:
    "Look up the cycle position, base-level trend, and bounding surfaces of a depositional systems tract within a stratigraphic sequence.",
  inputs: [
    {
      description: "Depositional systems tract.",
      enum: Object.keys(TRACTS),
      id: "systemsTract",
      kind: "string",
      label: "Systems tract",
    },
  ],
  outputs: [
    {
      description: "Position of the tract within the sea-level cycle.",
      id: "cyclePosition",
      kind: "string",
      label: "Cycle position",
    },
    {
      description: "Base-level/relative sea-level trend during deposition.",
      id: "baseLevelTrend",
      kind: "string",
      label: "Base-level trend",
    },
    {
      description: "Bounding stratigraphic surfaces above and below the tract.",
      id: "boundingSurfaces",
      kind: "string",
      label: "Bounding surfaces",
    },
    {
      description: "Summary of stacking pattern and depositional setting.",
      id: "description",
      kind: "string",
      label: "Description",
    },
  ],
  calculate: (input) =>
    calculateSystemsTractLookup(input as unknown as SystemsTractLookupInput),
});

export const runSystemsTractLookup = systemsTractLookupTool.execute;
export default systemsTractLookupTool;
