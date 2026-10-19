'use strict'

import { landings } from "./landings.js";
import { email } from "./email.js";

export const projects = {
  ...landings,
  ...email
}