import { upcAValidator as config } from "../../standard-identifiers/presets.js";
import { createIdentifierValidatorModule } from "../../standard-identifiers/shared.js";
const module = createIdentifierValidatorModule(config);
export const example = module.example;
export const identifierValidatorTool = module.tool;
export const runIdentifierValidator = module.run;
export default identifierValidatorTool;
