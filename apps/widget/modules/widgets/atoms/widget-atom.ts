import { atom } from "jotai";
import { WidgetScreens } from "@/modules/widgets/types";

export const screenAtom=atom<WidgetScreens>("auth");