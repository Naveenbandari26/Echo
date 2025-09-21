'use client'
import { AuthLayout } from "../layouts/auth-layout";
import { useOrganization } from "@clerk/nextjs";
import { OrgSelectionView } from "../views/org-select-view";

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();
    if (!organization) {
        return (
            <AuthLayout>
                <OrgSelectionView/>
            </AuthLayout>
        );
    }
    return <>{children}</>;
};
