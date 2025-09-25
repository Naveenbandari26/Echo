import { atom } from "jotai";
import {atomFamily, atomWithStorage} from "jotai/utils"
import { WidgetScreens } from "@/modules/widgets/types";
import { CONTACT_SESSION_KEY } from "../constants";
import { Id } from "@workspace/backend/_generated/dataModel";

export const screenAtom=atom<WidgetScreens>("loading");
export const organizationIdAtom=atom<string|null>("null")

//organization scoped contact session atom
export const contactSessionIdAtomFamily = atomFamily((organizationId:string )=>{

    return atomWithStorage<Id<"contactSessions"> | null>(`${CONTACT_SESSION_KEY}_${organizationId}`,null)
}
);

//error atom
export const errorMessageAtom=atom<string | null>(null);
export const loadingMessageAtom=atom<string | null>(null);

//conversationId atom
export const conversationIdAtom=atom<Id<"conversations"> | null>(null);
