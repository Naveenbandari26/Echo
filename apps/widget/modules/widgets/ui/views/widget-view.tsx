"use client";

import { WidgetFooter } from "../components/widget-footer";
import WidgetHeader from "../components/widget-header";

interface Props {
    organizationId?: string;
}

const WidgetView = ({ organizationId }: Props) => {
    return (
        <main className="min-h-screen min-w-screen flex flex-col overflow-hidden h-full w-full rounded-xl border bg-muted">
            <WidgetHeader className="rounded-t-xl">
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className=" text-3xl">Hey there </p>
                    <p className="text-lg">How can we help you today?</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1">
                 WidgetView - {organizationId}
            </div>
            <WidgetFooter/>
        </main>
    );
};
export default WidgetView;
