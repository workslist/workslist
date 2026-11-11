'use strict'

import { landings } from "./landings.js";
import { email } from "./email.js";
import { apps } from "./apps.js";

export const projects = {
  ...landings,
  ...email,
  ...apps
}