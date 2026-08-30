import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const propertyEntries = {
  escapeWheel: {
    keyDate: "Patek Philippe, 2005",
    statement:
      "Patek Philippe states that its first Silinvar escape wheel required no lubricant, reduced moving mass, resisted corrosion, and remained concentric.",
  },
  balanceSpring: {
    keyDate: "ETA silicon balance spring",
    statement:
      "ETA lists magnetic-field independence, temperature stability, oxidation resistance, aging resistance, shock resistance, and shape stability as advantages of its silicon balance spring.",
  },
  geometricFreedom: {
    keyDate: "silicon manufacturing",
    statement:
      "Breguet identifies low mass, wear and corrosion resistance, nonmagnetic behavior, and greater geometric freedom as silicon advantages for selected movement parts.",
  },
  materialCaution: {
    keyDate: "material distinction",
    statement:
      "Silicon, oxidized silicon derivatives, and other silicon materials are not interchangeable specifications; oxidation, geometry, and component role determine behavior.",
  },
  notUniversal: {
    keyDate: "design limitation",
    statement:
      "Silicon does not make an entire watch maintenance-free. The balance, pivots, train, lubricants, and assembled regulating organ still require material- and design-specific service.",
  },
  wearResistance: {
    keyDate: "contact surfaces",
    statement:
      "Breguet and Patek Philippe report that silicon escapement contact surfaces can avoid lubricant and offer high wear resistance, but the claim applies only to those designed components and interfaces.",
  },
} as const;

export type SiliconPropertyFocus = keyof typeof propertyEntries;

export type SiliconPropertyLookupInput = {
  readonly propertyFocus: SiliconPropertyFocus;
};

export type SiliconPropertyLookupOutput = {
  readonly keyDate: string;
  readonly propertyFocus: SiliconPropertyFocus;
  readonly verifiedStatement: string;
};

export const lookupSiliconWatchComponentProperty = (
  input: SiliconPropertyLookupInput,
): SiliconPropertyLookupOutput => {
  const entry = propertyEntries[input.propertyFocus];
  if (entry === undefined)
    simpleError(
      "propertyFocus",
      "Silicon property focus is not supported.",
      "unsupported_property_focus",
    );
  return {
    keyDate: entry.keyDate,
    propertyFocus: input.propertyFocus,
    verifiedStatement: entry.statement,
  };
};

export const siliconPropertyExample = {
  input: { propertyFocus: "wearResistance" },
  output: {
    keyDate: "contact surfaces",
    propertyFocus: "wearResistance",
    verifiedStatement:
      "Breguet and Patek Philippe report that silicon escapement contact surfaces can avoid lubricant and offer high wear resistance, but the claim applies only to those designed components and interfaces.",
  },
} satisfies ToolExample<
  SiliconPropertyLookupInput,
  SiliconPropertyLookupOutput
>;

export const siliconPropertyTool = createSimpleTool({
  calculate: (input) =>
    lookupSiliconWatchComponentProperty({
      propertyFocus: input.propertyFocus as SiliconPropertyFocus,
    }),
  description:
    "Return a manufacturer-source property or limitation for a silicon watch component, separating escape-wheel, balance-spring, wear, geometry, and material cautions.",
  id: "horology/silicon-watch-component-property-lookup",
  inputs: [
    {
      enum: [
        "escapeWheel",
        "balanceSpring",
        "wearResistance",
        "geometricFreedom",
        "materialCaution",
        "notUniversal",
      ],
      id: "propertyFocus",
      kind: "string",
      label: "Silicon watch-component property focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date, component, or status" },
    {
      id: "propertyFocus",
      kind: "string",
      label: "Silicon watch-component property focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified silicon-component statement",
    },
  ],
  title: "Silicon Watch Component Property Lookup",
});

export const runSiliconProperty = siliconPropertyTool.execute;
export default siliconPropertyTool;
