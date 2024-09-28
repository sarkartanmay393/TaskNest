import { createTypedHooks } from "easy-peasy";
import { IGlobalStore } from "../interfaces";

const typedHooks = createTypedHooks<IGlobalStore>();
export const { useStoreState, useStoreActions, useStoreDispatch } = typedHooks;
