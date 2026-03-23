# @toolio/tools

Framework-independent tool implementations for Tool.io applications,
services, command-line clients, and agents.

```ts
import {
  calculateBodyMassIndex
} from '@toolio/tools/body-mass-index';

const result = calculateBodyMassIndex({
  weightKg: 70,
  heightM: 1.8
});
```

Tool execution returns a discriminated result and never uses `undefined` as
an error value. Import individual tools through their package subpaths to keep
client bundles narrow.
