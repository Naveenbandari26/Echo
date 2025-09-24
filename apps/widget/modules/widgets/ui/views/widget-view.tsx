"use client";

// import { WidgetFooter } from "../components/widget-footer";
// import WidgetHeader from "../components/widget-header";
import WidgetAuthScreen from "../screens/widget-auth-screen";

interface Props {
    organizationId?: string;
}

const WidgetView = ({ organizationId }: Props) => {
    return (
        <main className="min-h-screen min-w-screen flex flex-col overflow-hidden h-full w-full rounded-xl border bg-muted">
           <WidgetAuthScreen/>
            <div className="flex flex-1">
                 WidgetView - {organizationId}
            </div>
            {/* <WidgetFooter/> */}
        </main>
    );
};
export default WidgetView;
